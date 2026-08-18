import { Request, Response } from 'express';
import db from '../database';

export function getAllBookings(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const bookings = db.prepare(`
      SELECT b.id, b.user_id, b.court_id, b.booking_date, b.start_time, b.end_time, b.total_price, b.status, c.name as court_name, c.location
      FROM bookings b
      JOIN courts c ON b.court_id = c.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `).all(req.userId);

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function createBooking(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { court_id, booking_date, start_time, end_time, total_price } = req.body;

    if (!court_id || !booking_date || !start_time || !end_time || !total_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const court = db.prepare('SELECT id FROM courts WHERE id = ?').get(court_id) as any;
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }

    const conflicting = db.prepare(`
      SELECT id FROM bookings
      WHERE court_id = ? AND booking_date = ? AND status != 'cancelled'
        AND start_time < ? AND end_time > ?
    `).get(court_id, booking_date, end_time, start_time);

    if (conflicting) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, 'confirmed')
    `);

    const result = stmt.run(req.userId, court_id, booking_date, start_time, end_time, total_price);

    const booking: any = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export function cancelBooking(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { id } = req.params;

    const booking: any = db.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?').get(id, req.userId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);

    res.json({ message: 'Booking cancelled' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
