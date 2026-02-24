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
    if (!currentUser?.id || currentUser?.role !== 'ADMIN') {
      setUsers([]);
      return;
    }
    getUsers(currentUser.id)
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [currentUser?.id, currentUser?.role]);

  const isAdmin = currentUser?.role === 'ADMIN';
  const isOwnerOrAdmin = currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN';

  if (!currentUser) {
    return (
      <Login
        onLogin={handleLogin}
        error={error}
        clearError={() => setError('')}
      />
    );
  }

  const navBtn = (t: Tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`top-tab ${tab === t ? 'top-tab-active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <MainLayout>
      <header className="hero-card">
        <h1 className="hero-title">Meeting Room Booking</h1>
        <div className="hero-user-row">
          <div className="hero-user-name">{currentUser.name}</div>
          <button
            type="button"
            onClick={handleLogout}
            className="hero-logout-btn"
          >
            Log out
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </header>

      <nav className="top-tab-bar">
        {navBtn('bookings', 'Bookings')}
        {isOwnerOrAdmin && navBtn('summary', 'Usage Summary')}
        {isAdmin && navBtn('users', 'User Management')}
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
