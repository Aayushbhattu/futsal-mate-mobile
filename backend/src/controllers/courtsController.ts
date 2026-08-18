import { Request, Response } from 'express';
import db from '../database';

export function getAllCourts(req: Request, res: Response) {
  try {
    const courts = db.prepare('SELECT id, name, location, price_per_hour, rating, image_url, description FROM courts').all();
    res.json(courts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function getCourtById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const court: any = db.prepare('SELECT * FROM courts WHERE id = ?').get(id);

    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    res.json(court);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
