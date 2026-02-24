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
        onError(msg);
      });
  };

  const handleDelete = (id: number, bookingUserId: number) => {
    const canDelete =
      currentUser.role === 'ADMIN' || currentUser.role === 'OWNER' || bookingUserId === currentUser.id;
    if (!canDelete) {
      showModal('Not allowed', 'You can only delete your own bookings.', 'error');
      return;
    }
    clearError();
    deleteBooking(currentUser.id, id)
      .then(() => {
        showModal('Success', 'Booking deleted.', 'success');
        load();
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('Delete failed', msg, 'error');
        onError(msg);
      });
  };

  return (
    <section>
      <h2>Bookings</h2>
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
              dateFormat="dd/MM/yyyy, HH:mm"
              minDate={new Date()}
              placeholderText="00/00/0000, 00:00"
              className="picker-input"
            />
          </label>
          <label>
            End
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="dd/MM/yyyy, HH:mm"
              minDate={startTime ?? new Date()}
              placeholderText="00/00/0000, 00:00"
              className="picker-input"
            />
          </label>
          <button
            type="submit"
            className="primary-action-btn"
          >
            Create booking
          </button>
        </div>
      </form>
      <PopupModal
        open={modalOpen}
        title={modalTitle}
        variant={modalVariant}
        onClose={() => setModalOpen(false)}
      >
        {message}
      </PopupModal>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ padding: 8 }}>Room</th>
              <th style={{ padding: 8 }}>Start</th>
              <th style={{ padding: 8 }}>End</th>
              <th style={{ padding: 8 }}>Created by</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: '#6b7280' }}>
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
                    <td style={{ padding: 8 }}>{formatDateTime(b.startTime)}</td>
                    <td style={{ padding: 8 }}>{formatDateTime(b.endTime)}</td>
                    <td style={{ padding: 8 }}>{b.userName ?? b.userId}</td>
                    <td style={{ padding: 8 }}>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDelete(b.id, b.userId)}
                          className="danger-action-btn"
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
