import process from 'process';

const PORT = process.env.PORT || '3999';
const BASE = `http://localhost:${PORT}/api`;

async function req(method: string, path: string, body?: any, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  // Start the app (import triggers listen on the PORT env var)
  process.env.PORT = String(PORT);
  const { default: _app } = await import('../src/app');

  let failures = 0;
  const check = (label: string, status: number, ok: boolean) => {
    console.log(`${ok ? '✅' : '❌'} ${label} -> ${status}`);
    if (!ok) failures++;
  };

  const health = await fetch(`http://localhost:${PORT}/health`).then(r => r.json());
  check('health', 200, health.status === 'OK');

  const courts = await req('GET', '/courts');
  check('GET /courts', courts.status, Array.isArray(courts.data) && courts.data.length === 5);

  const offers = await req('GET', '/offers');
  check('GET /offers', offers.status, Array.isArray(offers.data) && offers.data.length >= 2);

  const teams = await req('GET', '/teams');
  check('GET /teams', teams.status, Array.isArray(teams.data) && teams.data.length === 3);

  const randomEmail = `smoke${Date.now()}@test.com`;
  const signup = await req('POST', '/auth/signup', { email: randomEmail, password: 'pass123', full_name: 'Smoke Test' });
  check('POST /auth/signup', signup.status, !!signup.data.token);

  const login = await req('POST', '/auth/login', { email: 'testuser@futsal.com', password: 'pass123' });
  check('POST /auth/login (seed user)', login.status, !!login.data.token);

  const token = login.data.token as string;

  const me = await req('GET', '/auth/me', undefined, token);
  check('GET /auth/me', me.status, me.data.email === 'testuser@futsal.com');

  const bookingDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
  const booking = await req('POST', '/bookings', { court_id: 1, booking_date: bookingDate, start_time: '08:00', end_time: '09:00', total_price: 50 }, token);
  check('POST /bookings', booking.status, !!booking.data.id);

  const duplicate = await req('POST', '/bookings', { court_id: 1, booking_date: bookingDate, start_time: '08:30', end_time: '09:30', total_price: 50 }, token);
  check('POST /bookings (conflict -> 409)', duplicate.status, duplicate.status === 409);

  const bookings = await req('GET', '/bookings', undefined, token);
  check('GET /bookings', bookings.status, Array.isArray(bookings.data) && bookings.data.length === 1);

  const cancel = await req('DELETE', `/bookings/${booking.data.id}`, undefined, token);
  check('DELETE /bookings/:id', cancel.status, cancel.data.message === 'Booking cancelled');

  const fav = await req('POST', '/favorites', { court_id: 2 }, token);
  check('POST /favorites', fav.status, fav.data.court_id === 2);

  const favorites = await req('GET', '/favorites', undefined, token);
  check('GET /favorites', favorites.status, favorites.data.length === 1);

  const favRemove = await req('DELETE', '/favorites/2', undefined, token);
  check('DELETE /favorites/:court_id', favRemove.status, favRemove.data.message === 'Removed from favorites');

  const join = await req('POST', '/teams/1/join', undefined, token);
  check('POST /teams/:id/join', join.status, join.data.message === 'Joined team successfully');

  const joinAgain = await req('POST', '/teams/1/join', undefined, token);
  check('POST /teams/:id/join (duplicate -> 409)', joinAgain.status, joinAgain.status === 409);

  console.log(failures === 0 ? '\n🎉 All smoke tests passed!' : `\n❌ ${failures} test(s) failed`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
