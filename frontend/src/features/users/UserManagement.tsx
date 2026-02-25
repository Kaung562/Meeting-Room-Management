import { useState, useEffect, FormEvent } from 'react';
import { getUsers, createUser, updateUserRole, deleteUser, getSummary } from '../../lib/api';
import { ROLES } from '../../constants';
import type { User } from '../../types';
import ModernSelect from '../../components/ModernSelect';
import ConfirmModal from '../../components/ConfirmModal';
import PopupModal from '../../components/PopupModal';

interface UserManagementProps {
  currentUserId: number;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onError: (message: string) => void;
}

export default function UserManagement({
  currentUserId,
  users,
  setUsers,
}: UserManagementProps) {
  const manageableRoles = ROLES.filter((r) => r !== 'ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('USER');
  const [message, setMessage] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    label: string;
    bookingCount: number;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState<'success' | 'error' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState('Info');

  const showModal = (title: string, text: string, variant: 'success' | 'error' | 'info') => {
    setModalTitle(title);
    setMessage(text);
    setModalVariant(variant);
    setModalOpen(true);
  };

  useEffect(() => {
    getUsers(currentUserId)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [currentUserId]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!username.trim()) {
      showModal('Validation error', 'Username is required.', 'error');
      return;
    }
    if (!password) {
      showModal('Validation error', 'Password is required.', 'error');
      return;
    }
    if (!name.trim()) {
      showModal('Validation error', 'Name is required.', 'error');
      return;
    }
    createUser(currentUserId, {
      username: username.trim(),
      password,
      name: name.trim(),
      role,
    })
      .then((user) => {
        setUsers((prev) => [...prev, user]);
        setUsername('');
        setPassword('');
        setName('');
        setRole('USER');
        showModal('Success', 'User created.', 'success');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('User creation failed', msg, 'error');
      });
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setMessage('');
    updateUserRole(currentUserId, id, newRole)
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        showModal('Success', 'Role updated.', 'success');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('Role update failed', msg, 'error');
      });
  };

  const performDelete = (id: number) => {
    if (id === currentUserId) {
      showModal('Not allowed', 'Cannot delete your own user.', 'error');
      return;
    }
    setMessage('');
    deleteUser(currentUserId, id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        showModal('Success', 'User deleted. Their bookings were also removed.', 'success');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        showModal('Delete failed', msg, 'error');
      });
  };

  const handleDelete = async (id: number, username: string, name: string) => {
    if (id === currentUserId) {
      showModal('Not allowed', 'Cannot delete your own user.', 'error');
      return;
    }

    try {
      const summary = await getSummary(currentUserId);
      const target = summary.find((item) => item.user.id === id);
      const bookingCount = target?.totalBookings ?? 0;

      if (bookingCount > 0) {
        setDeleteTarget({
          id,
          label: `${name} (${username})`,
          bookingCount,
        });
        return;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      showModal('Failed to check bookings', msg, 'error');
      return;
    }

    performDelete(id);
  };

  return (
    <section>
      <h2>User Management</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              placeholder="Username"
              className="form-control"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="form-control"
            />
          </label>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              className="form-control"
            />
          </label>
          <label>
            Role
            <ModernSelect
              value={role}
              onChange={setRole}
              options={manageableRoles.map((r) => ({ value: r, label: r }))}
              placeholder="Select role"
            />
          </label>
          <button
            type="submit"
            className="primary-action-btn"
          >
            Create user
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
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Username</th>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Role</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: 8 }}>{u.username}</td>
              <td style={{ padding: 8 }}>{u.name}</td>
              <td style={{ padding: 8, fontSize: 12, color: '#6b7280' }}>{u.id}</td>
              <td style={{ padding: 8 }}>
                {u.role === 'ADMIN' ? (
                  <div className="modern-select-root role-select-readonly">
                    <div className="modern-select-trigger modern-select-trigger-readonly">
                      <span className="modern-select-value">ADMIN</span>
                    </div>
                  </div>
                ) : (
                  <ModernSelect
                    value={u.role}
                    onChange={(newRole) => handleRoleChange(u.id, newRole)}
                    options={manageableRoles.map((r) => ({ value: r, label: r }))}
                  />
                )}
              </td>
              <td style={{ padding: 8 }}>
                {u.id !== currentUserId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(u.id, u.username, u.name)}
                    className="danger-action-btn"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete user warning"
        message={
          deleteTarget
            ? `This user has ${deleteTarget.bookingCount} booking(s). If you continue, this user and their bookings will be deleted.`
            : ''
        }
        confirmText="Delete anyway"
        cancelText="Cancel"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const id = deleteTarget.id;
          setDeleteTarget(null);
          performDelete(id);
        }}
      />
    </section>
  );
}
