import { useState, FormEvent } from 'react';

interface LoginProps {
  onLogin: (username: string, password: string) => void;
  error: string;
  clearError: () => void;
}

export default function Login({ onLogin, error, clearError }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    clearError();
    onLogin(username.trim(), password);
  };

  return (
    <div style={{ maxWidth: 360, margin: '48px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
      <h1 style={{ marginTop: 0, marginBottom: 24 }}>Meeting Room Booking</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>Sign in with your username and password.</p>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: 8 }}>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          style={{ width: '100%', padding: '8px 12px', marginBottom: 16, fontSize: 14, boxSizing: 'border-box' }}
        />
        <label style={{ display: 'block', marginBottom: 8 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          style={{ width: '100%', padding: '8px 12px', marginBottom: 24, fontSize: 14, boxSizing: 'border-box' }}
        />
        {error && <div className="error" style={{ marginBottom: 16 }}>{error}</div>}
        <button
          type="submit"
          style={{ width: '100%', padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Log in
        </button>
      </form>
      <p style={{ marginTop: 24, fontSize: 12, color: '#9ca3af' }}>
        Default admin: username <strong>admin</strong>, password <strong>admin123</strong>
      </p>
    </div>
  );
}
