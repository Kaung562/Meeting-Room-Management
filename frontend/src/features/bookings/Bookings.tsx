import { useState, useEffect, FormEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getBookings, createBooking, deleteBooking, getRooms } from '../../lib/api';
import { formatDateTime } from '../../helpers/date';
import type { User, Booking, Room } from '../../types';
import PopupModal from '../../components/PopupModal';
import ModernSelect from '../../components/ModernSelect';

interface BookingsProps {
  currentUser: User;
  onError: (message: string) => void;
  clearError: () => void;
}

export default function Bookings({ currentUser, onError, clearError }: BookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('Info');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showModal = (title: string, text: string, variant: 'success' | 'error' | 'info') => {
    setModalTitle(title);
    setMessage(text);
    setModalVariant(variant);
    setModalOpen(true);
  };

  const load = () => {
    if (!currentUser?.id) return;
    setLoading(true);
    Promise.all([getBookings(currentUser.id), getRooms(currentUser.id)])
      .then(([bookingsData, roomsData]) => {
        setBookings(bookingsData);
        setRooms(roomsData);
      })
      .catch((e) => onError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [currentUser?.id]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    clearError();
    setMessage('');
    const roomId = Number(selectedRoomId);
    if (!Number.isInteger(roomId) || roomId <= 0) {
      showModal('Validation error', 'Please select a meeting room.', 'error');
      return;
    }
    if (!startTime || !endTime) {
      showModal('Validation error', 'Please set both start and end time.', 'error');
      return;
    }
    const startTs = startTime.getTime();
    const endTs = endTime.getTime();
    if (Number.isNaN(startTs) || Number.isNaN(endTs)) {
      showModal('Validation error', 'Please choose valid start and end date/time.', 'error');
      return;
    }
    if (startTs < Date.now()) {
      showModal('Validation error', 'Start time must be now or later.', 'error');
      return;
    }
    if (startTs >= endTs) {
      showModal('Validation error', 'Start time must be before end time.', 'error');
      return;
    }
    setSubmitting(true);
    createBooking(currentUser.id, { roomId, startTime: startTime.toISOString(), endTime: endTime.toISOString() })
      .then(() => {
        setSelectedRoomId('');
        setStartTime(null);
        setEndTime(null);
        showModal('Success', 'Booking created.', 'success');
        load();
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('Booking failed', msg, 'error');
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (id: number, bookingUserId: number) => {
    if (deletingId === id) return;
    const canDelete =
      currentUser.role === 'ADMIN' || currentUser.role === 'OWNER' || bookingUserId === currentUser.id;
    if (!canDelete) {
      showModal('Not allowed', 'You can only delete your own bookings.', 'error');
      return;
    }
    clearError();
    setDeletingId(id);
    deleteBooking(currentUser.id, id)
      .then(() => {
        showModal('Success', 'Booking deleted.', 'success');
        load();
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('Delete failed', msg, 'error');
      })
      .finally(() => setDeletingId(null));
  };

  function DateCell({ iso }: { iso: string }) {
    const formatted = formatDateTime(iso);
  
    const match = formatted.match(/(.*\d{2}:\d{2})\s*(am|pm|AM|PM)/i);
  
    if (!match) return <>{formatted}</>;
  
    return (
      <>
        {match[1]}{' '}
        <span className="meridiem">
          {match[2].toUpperCase()}
        </span>
      </>
    );
  }

  return (
    <section>
      <h2>Bookings</h2>
      {currentUser.role !== 'ADMIN' && (
        <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
            <label>
              Meeting room
              <ModernSelect
                value={selectedRoomId}
                onChange={setSelectedRoomId}
                options={[
                  { value: '', label: 'Select room' },
                  ...rooms.map((room) => ({ value: String(room.id), label: room.name })),
                ]}
                placeholder="Select room"
              />
            </label>
            <label>
              Start
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy, hh:mm aa"
                minDate={new Date()}
                placeholderText="00/00/0000, 00:00 AM"
                className="picker-input"
              />
            </label>
            <label>
              End
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                dateFormat="dd/MM/yyyy, hh:mm aa"
                minDate={startTime ?? new Date()}
                placeholderText="00/00/0000, 00:00 AM"
                className="picker-input"
              />
            </label>
            <button
              type="submit"
              className="primary-action-btn"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create booking'}
            </button>
          </div>
        </form>
      )}
      <PopupModal
        open={modalOpen}
        title={modalTitle}
        variant={modalVariant}
        onClose={() => setModalOpen(false)}
      >
        {message}
      </PopupModal>
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
        }}
      >
        {loading ? (
          <p>Loading…</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                <th style={{ padding: 8 }}>Room</th>
                <th style={{ padding: 8 }}>Start</th>
                <th style={{ padding: 8 }}>End</th>
                <th style={{ padding: 8 }}>Created at</th>
                <th style={{ padding: 8 }}>Created by</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16, color: '#6b7280' }}>
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const canDelete =
                    currentUser.role === 'ADMIN' ||
                    currentUser.role === 'OWNER' ||
                    b.userId === currentUser.id;
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: 8 }}>{b.room?.name ?? `Room #${b.roomId}`}</td>
                      <td style={{ padding: 8 }}><DateCell iso={b.startTime} /></td>
                      <td style={{ padding: 8 }}><DateCell iso={b.endTime} /></td>
                      <td style={{ padding: 8 }}><DateCell iso={b.createdAt} /></td>
                      <td style={{ padding: 8 }}>{b.userName ?? b.userId}</td>
                      <td style={{ padding: 8 }}>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(b.id, b.userId)}
                            className="danger-action-btn"
                            disabled={deletingId === b.id}
                          >
                            {deletingId === b.id ? 'Deleting…' : 'Delete'}
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
      </div>
    </section>
  );
}
