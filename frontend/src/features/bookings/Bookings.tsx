import { useState, useEffect, FormEvent } from 'react';
import { getBookings, createBooking, deleteBooking } from '../../lib/api';
import { formatDateTime, toLocalDatetime } from '../../helpers/date';
import type { User, Booking } from '../../types';

interface BookingsProps {
  currentUser: User;
  onError: (message: string) => void;
  clearError: () => void;
}

export default function Bookings({ currentUser, onError, clearError }: BookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const load = () => {
    if (!currentUser?.id) return;
    setLoading(true);
    getBookings(currentUser.id)
      .then(setBookings)
      .catch((e) => onError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [currentUser?.id]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage('');
    if (!startTime || !endTime) {
      setMessage('Please set both start and end time.');
      return;
    }
    createBooking(currentUser.id, { startTime, endTime })
      .then(() => {
        setStartTime('');
        setEndTime('');
        setMessage('Booking created.');
        load();
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMessage(msg);
        onError(msg);
      });
  };

  const handleDelete = (id: number, bookingUserId: number) => {
    const canDelete =
      currentUser.role === 'admin' || currentUser.role === 'owner' || bookingUserId === currentUser.id;
    if (!canDelete) {
      setMessage('You can only delete your own bookings.');
      return;
    }
    clearError();
    setMessage('');
    deleteBooking(currentUser.id, id)
      .then(() => {
        setMessage('Booking deleted.');
        load();
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMessage(msg);
        onError(msg);
      });
  };

  return (
    <section>
      <h2>Bookings</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <label>
            Start
            <input
              type="datetime-local"
              value={toLocalDatetime(startTime)}
              onChange={(e) =>
                setStartTime(e.target.value ? new Date(e.target.value).toISOString() : '')
              }
              style={{ display: 'block', marginTop: 4, padding: 6 }}
            />
          </label>
          <label>
            End
            <input
              type="datetime-local"
              value={toLocalDatetime(endTime)}
              onChange={(e) =>
                setEndTime(e.target.value ? new Date(e.target.value).toISOString() : '')
              }
              style={{ display: 'block', marginTop: 4, padding: 6 }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Create booking
          </button>
        </div>
      </form>
      {message && (
        <div
          className={
            message.includes('created') || message.includes('deleted') ? 'success' : 'error'
          }
        >
          {message}
        </div>
      )}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Start</th>
              <th style={{ padding: 8 }}>End</th>
              <th style={{ padding: 8 }}>Created by</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: 16, color: '#6b7280' }}>
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const canDelete =
                  currentUser.role === 'admin' ||
                  currentUser.role === 'owner' ||
                  b.userId === currentUser.id;
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: 8 }}>{formatDateTime(b.startTime)}</td>
                    <td style={{ padding: 8 }}>{formatDateTime(b.endTime)}</td>
                    <td style={{ padding: 8 }}>{b.userName ?? b.userId}</td>
                    <td style={{ padding: 8 }}>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.userId)}
                          style={{
                            padding: '4px 10px',
                            background: '#fef2f2',
                            color: '#b91c1c',
                            border: '1px solid #fecaca',
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
