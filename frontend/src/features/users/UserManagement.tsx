import { useState, useEffect, FormEvent } from 'react';
import { getUsers, createUser, updateUserRole, deleteUser } from '../../lib/api';
import { ROLES } from '../../constants';
import type { User } from '../../types';

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
  onError,
}: UserManagementProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>('user');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUsers(currentUserId)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [currentUserId]);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!username.trim()) {
      setMessage('Username is required.');
      return;
    }
    if (!password) {
      setMessage('Password is required.');
      return;
    }
    if (!name.trim()) {
      setMessage('Name is required.');
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
        setRole('user');
        setMessage('User created.');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMessage(msg);
        onError(msg);
      });
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setMessage('');
    updateUserRole(currentUserId, id, newRole)
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        setMessage('Role updated.');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMessage(msg);
        onError(msg);
      });
  };

  const handleDelete = (id: number) => {
    if (id === currentUserId) {
      setMessage('Cannot delete your own user.');
      return;
    }
    setMessage('');
    deleteUser(currentUserId, id)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setMessage('User deleted. Their bookings were also removed.');
      })
      .catch((e) => {
        const msg = e instanceof Error ? e.message : String(e);
        setMessage(msg);
        onError(msg);
      });
  };

  return (
    <section>
      <h2>User Management (Admin)</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={{ display: 'block', marginTop: 4, padding: 6 }}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{ display: 'block', marginTop: 4, padding: 6 }}
            />
          </label>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name"
              style={{ display: 'block', marginTop: 4, padding: 6 }}
            />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: 6 }}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Create user
          </button>
        </div>
      </form>
      {message && (
        <div
          className={
            message.includes('created') || message.includes('updated') || message.includes('deleted')
              ? 'success'
              : 'error'
          }
        >
          {message}
        </div>
      )}
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
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  style={{ padding: 4 }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: 8 }}>
                {u.id !== currentUserId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(u.id)}
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
          ))}
        </tbody>
      </table>
    </section>
  );
}
