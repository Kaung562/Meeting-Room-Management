import { useState, useEffect } from 'react';
import { getSummary } from '../../lib/api';
import { formatDateTime } from '../../helpers/date';
import type { UserSummaryItem } from '../../types';

interface SummaryProps {
  currentUserId: number;
  onError: (message: string) => void;
}

export default function Summary({ currentUserId, onError }: SummaryProps) {
  const [summary, setSummary] = useState<UserSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSummary(currentUserId)
      .then(setSummary)
      .catch((e) => onError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [currentUserId, onError]);

  if (loading) return <p>Loading summary…</p>;

  function DateCell({ iso }: { iso: string }) {
    const formatted = formatDateTime(iso);
    const match = formatted.match(/(.*\d{2}:\d{2})\s*(am|pm|AM|PM)/i);
    if (!match) return <>{formatted}</>;

    return (
      <>
        {match[1]} <span className="meridiem">{match[2].toUpperCase()}</span>
      </>
    );
  }

  return (
    <section>
      <h2>Usage Summary</h2>
      {summary.length === 0 ? (
        <p>No data.</p>
      ) : (
        summary.map(({ user, totalBookings, bookings }) => (
          <div
            key={user.id}
            style={{
              marginBottom: 24,
              padding: 16,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>
              {user.name}{' '}
              <span className={`role-pill role-pill-${user.role.toLowerCase()}`}>{user.role}</span>
            </h3>
            <p style={{ margin: '0 0 12px 0', color: '#6b7280' }}>
              Total bookings: <strong>{totalBookings}</strong>
            </p>
            {bookings.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: 6 }}>Room</th>
                    <th style={{ padding: 6 }}>Start</th>
                    <th style={{ padding: 6 }}>End</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: 6 }}>{b.roomName}</td>
                      <td style={{ padding: 6 }}><DateCell iso={b.startTime} /></td>
                      <td style={{ padding: 6 }}><DateCell iso={b.endTime} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </section>
  );
}
