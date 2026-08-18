import { Request, Response } from 'express';
import db from '../database';

export function getAllOffers(req: Request, res: Response) {
  try {
    const offers = db.prepare(`
      SELECT o.id, o.court_id, o.title, o.description, o.discount, o.valid_until, o.image_url, o.type, c.name as court_name
      FROM offers o
      JOIN courts c ON o.court_id = c.id
      WHERE DATE(o.valid_until) >= DATE('now')
    `).all();

    res.json(offers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
