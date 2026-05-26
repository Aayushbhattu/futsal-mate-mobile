import { Request, Response } from 'express';
import db from '../database';

export function getAllTeams(req: Request, res: Response) {
  try {
    const teams = db.prepare(`
      SELECT t.id, t.name, t.description, t.location, t.member_count, t.created_by, t.created_at
      FROM teams t
    `).all();

    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function joinTeam(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    try {
      db.prepare('INSERT INTO team_members (team_id, user_id) VALUES (?, ?)').run(id, req.userId);

      db.prepare('UPDATE teams SET member_count = member_count + 1 WHERE id = ?').run(id);

      res.json({ message: 'Joined team successfully' });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Already a member of this team' });
      }
      throw err;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
