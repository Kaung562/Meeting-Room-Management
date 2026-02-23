import { useState, useEffect } from 'react';
import { login, getMe, getUsers } from '../lib/api';
import { STORAGE_KEYS } from '../constants';
import MainLayout from '../layouts/MainLayout';
import Login from '../features/auth/Login';
import Bookings from '../features/bookings/Bookings';
import UserManagement from '../features/users/UserManagement';
import Summary from '../features/summary/Summary';
import type { User } from '../types';

function getStoredUser(): User | null {
  try {
    const s = localStorage.getItem(STORAGE_KEYS.USER);
    return s ? (JSON.parse(s) as User) : null;
  } catch {
    return null;
  }
}

type Tab = 'bookings' | 'summary' | 'users';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('bookings');

  const handleLogin = (username: string, password: string) => {
    setError('');
    login(username, password)
      .then((user) => {
        setCurrentUser(user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsers([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setError('');
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    setError('');
    getMe(currentUser.id)
      .then((user) => setCurrentUser((prev) => (prev ? { ...prev, ...user } : null)))
      .catch((e) => {
        setError(e instanceof Error ? e.message : String(e));
        handleLogout();
      });
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || currentUser?.role !== 'admin') {
      setUsers([]);
      return;
    }
    getUsers(currentUser.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [currentUser?.id, currentUser?.role]);

  const isAdmin = currentUser?.role === 'admin';
  const isOwnerOrAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        error={error}
        clearError={() => setError('')}
      />
    );
  }

  const navBtn = (t: Tab, label: string, activeBg = '#e0e7ff') => (
    <button
      type="button"
      onClick={() => setTab(t)}
      style={{
        padding: '8px 16px',
        fontWeight: tab === t ? 600 : 400,
        background: tab === t ? activeBg : '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );

  return (
    <MainLayout>
      <header style={{ marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
        <h1 style={{ margin: '0 0 16px 0' }}>Meeting Room Booking</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span className={`role-badge role-${currentUser.role}`}>{currentUser.name}</span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Log out
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </header>

      <nav style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {navBtn('bookings', 'Bookings')}
        {isOwnerOrAdmin && navBtn('summary', 'Usage Summary', '#d1fae5')}
        {isAdmin && navBtn('users', 'User Management', '#ede9fe')}
      </nav>

      {tab === 'bookings' && (
        <Bookings currentUser={currentUser} onError={setError} clearError={() => setError('')} />
      )}
      {tab === 'summary' && isOwnerOrAdmin && (
        <Summary currentUserId={currentUser.id} onError={setError} />
      )}
      {tab === 'users' && isAdmin && (
        <UserManagement
          currentUserId={currentUser.id}
          users={users}
          setUsers={setUsers}
          onError={setError}
        />
      )}
    </MainLayout>
  );
}
