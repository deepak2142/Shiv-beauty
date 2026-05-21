import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminGetStats } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    adminGetStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🌸 Shiv Admin</div>
        <nav style={styles.nav}>
          <Link to="/admin" style={styles.navLink}>📊 Dashboard</Link>
          <Link to="/admin/products" style={styles.navLink}>📦 Products</Link>
          <Link to="/admin/orders" style={styles.navLink}>🛒 Orders</Link>
          <Link to="/" style={styles.navLink}>🌐 View Site</Link>
          <span style={styles.navLink} onClick={handleLogout}>🚪 Logout</span>
        </nav>
        <div style={styles.adminInfo}>{user?.name}</div>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.title}>Dashboard</h1>

        <div style={styles.statsGrid}>
          {[
            { label: 'Products', value: stats?.totalProducts ?? '—', icon: '📦', color: '#e91e8c' },
            { label: 'Orders', value: stats?.totalOrders ?? '—', icon: '🛒', color: '#2196f3' },
            { label: 'Customers', value: stats?.totalUsers ?? '—', icon: '👥', color: '#4caf50' },
            { label: 'Revenue (Paid)', value: stats ? `₹${stats.totalRevenue}` : '—', icon: '💰', color: '#ff9800' }
          ].map(s => (
            <div key={s.label} style={{ ...styles.statCard, borderTop: `4px solid ${s.color}` }}>
              <div style={styles.statIcon}>{s.icon}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          {stats?.recentOrders?.map(order => (
            <div key={order._id} style={styles.orderRow}>
              <span>#{order._id.slice(-8).toUpperCase()}</span>
              <span>{order.user?.name}</span>
              <span style={{ color: '#e91e8c', fontWeight: 700 }}>₹{order.totalAmount}</span>
              <span style={{ color: order.orderStatus === 'delivered' ? '#4caf50' : '#ff9800' }}>{order.orderStatus}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '240px', background: '#1a1a2e', color: '#fff', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '1.3rem', fontWeight: 800, padding: '0 24px 24px', borderBottom: '1px solid #333', color: '#e91e8c' },
  nav: { padding: '20px 0', flex: 1 },
  navLink: { display: 'block', padding: '12px 24px', color: '#ccc', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', transition: 'background 0.2s' },
  adminInfo: { padding: '16px 24px', borderTop: '1px solid #333', color: '#888', fontSize: '0.85rem' },
  main: { flex: 1, padding: '30px', background: '#f5f5f5' },
  title: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '28px', color: '#222' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' },
  statCard: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: '1.8rem', marginBottom: '12px' },
  statValue: { fontSize: '1.8rem', fontWeight: 800, color: '#222', marginBottom: '4px' },
  statLabel: { color: '#999', fontSize: '0.9rem' },
  section: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: '#333' },
  orderRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#555' }
};

export default AdminDashboard;
