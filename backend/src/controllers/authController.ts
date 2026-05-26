import { Request, Response } from 'express';
import db from '../database';
import { generateToken, hashPassword, comparePassword } from '../middleware/auth';

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await hashPassword(password);

    const stmt = db.prepare(`
      INSERT INTO users (email, password, full_name, phone)
      VALUES (?, ?, ?, ?)
    `);

    try {
      const result = stmt.run(email, hashedPassword, full_name, phone || null);
      const user = db.prepare('SELECT id, email, full_name, phone FROM users WHERE id = ?').get(result.lastInsertRowid);
      const token = generateToken(user.id as number, user.email);

      res.json({ user, token });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      throw err;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await comparePassword(password, user.password as string);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id as number, user.email);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function getMe(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = db.prepare('SELECT id, email, full_name, phone FROM users WHERE id = ?').get(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
