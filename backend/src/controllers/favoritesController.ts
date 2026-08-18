import { Request, Response } from 'express';
import db from '../database';

export function getAllFavorites(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const favorites = db.prepare(`
      SELECT f.id, f.court_id, c.name, c.location, c.price_per_hour, c.rating, c.image_url, c.description
      FROM favorites f
      JOIN courts c ON f.court_id = c.id
      WHERE f.user_id = ?
    `).all(req.userId);

    res.json(favorites);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function addFavorite(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { court_id } = req.body;

    if (!court_id) {
      return res.status(400).json({ error: 'Missing court_id' });
    }

    try {
      const result = db.prepare('INSERT INTO favorites (user_id, court_id) VALUES (?, ?)').run(req.userId, court_id);

      res.json({ id: result.lastInsertRowid, user_id: req.userId, court_id });
    } catch (err: any) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Already in favorites' });
      }
      throw err;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function removeFavorite(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { court_id } = req.params;

    const favorite: any = db.prepare('SELECT * FROM favorites WHERE user_id = ? AND court_id = ?').get(req.userId, court_id);

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    db.prepare('DELETE FROM favorites WHERE user_id = ? AND court_id = ?').run(req.userId, court_id);

    res.json({ message: 'Removed from favorites' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
