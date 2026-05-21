import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.name}!`);
      navigate(res.data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌸 Welcome Back</h1>
        <p style={styles.sub}>Login to your Shiv Beauty account</p>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
        </div>
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <p style={styles.switch}>Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link></p>
      </div>
    </div>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { registerUser } = require('../utils/api');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) return toast.error('Name, email and password required');
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      toast.success(`Welcome, ${res.data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌸 Create Account</h1>
        <p style={styles.sub}>Join Shiv Beauty today</p>
        {['name', 'email', 'phone', 'password'].map(field => (
          <div key={field} style={styles.field}>
            <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              style={styles.input}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={field === 'phone' ? 'Optional' : ''}
            />
          </div>
        ))}
        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        <p style={styles.switch}>Already have an account? <Link to="/login" style={styles.link}>Login</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 20px', background: '#fff8f9' },
  card: { background: '#fff', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 30px rgba(233,30,140,0.12)' },
  title: { fontSize: '1.8rem', fontWeight: 800, color: '#c2185b', margin: '0 0 8px', textAlign: 'center' },
  sub: { color: '#999', textAlign: 'center', marginBottom: '28px' },
  field: { marginBottom: '18px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: '#555' },
  input: { width: '100%', padding: '12px 16px', border: '1px solid #eee', borderRadius: '10px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', background: '#fafafa' },
  btn: { width: '100%', background: '#e91e8c', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  switch: { textAlign: 'center', marginTop: '16px', color: '#777', fontSize: '0.9rem' },
  link: { color: '#e91e8c', fontWeight: 700, textDecoration: 'none' }
};
