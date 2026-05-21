import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetOrders, adminUpdateOrder } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColor = { placed: '#ff9800', confirmed: '#2196f3', shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336' };
const payColor = { pending: '#ff9800', paid: '#4caf50', failed: '#f44336' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    adminGetOrders().then(r => setOrders(r.data)).catch(() => {});
  }, []);

  const updateOrder = async (id, field, value) => {
    try {
      const res = await adminUpdateOrder(id, { [field]: value });
      setOrders(prev => prev.map(o => o._id === id ? res.data : o));
      toast.success('Order updated!');
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🌸 Shiv Admin</div>
        <nav style={styles.nav}>
          <Link to="/admin" style={styles.navLink}>📊 Dashboard</Link>
          <Link to="/admin/products" style={styles.navLink}>📦 Products</Link>
          <Link to="/admin/orders" style={{ ...styles.navLink, background: '#e91e8c22', color: '#e91e8c' }}>🛒 Orders</Link>
          <Link to="/" style={styles.navLink}>🌐 View Site</Link>
        </nav>
      </aside>

      <main style={styles.main}>
        <h1 style={styles.title}>Orders ({orders.length})</h1>

        {orders.map(order => (
          <div key={order._id} style={styles.card}>
            <div style={styles.cardTop} onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
              <div>
                <div style={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</div>
                <div style={styles.meta}>
                  {order.user?.name} • {order.user?.email} • {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>
              <div style={styles.right}>
                <span style={{ color: '#e91e8c', fontWeight: 800 }}>₹{order.totalAmount}</span>
                <span style={{ ...styles.badge, background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>
                  {order.orderStatus}
                </span>
                <span style={{ ...styles.badge, background: payColor[order.paymentStatus] + '22', color: payColor[order.paymentStatus] }}>
                  {order.paymentStatus}
                </span>
                <span style={styles.chevron}>{expanded === order._id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === order._id && (
              <div style={styles.details}>
                <div style={styles.items}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.item}>
                      <span>{item.name}</span>
                      <span>× {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.address}>
                  <strong>Shipping:</strong> {order.shippingAddress?.name}, {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode} | 📞 {order.shippingAddress?.phone}
                </div>

                {order.upiTransactionId && <div style={styles.upiTx}>UPI Tx ID: {order.upiTransactionId}</div>}

                <div style={styles.controls}>
                  <div>
                    <label style={styles.label}>Order Status</label>
                    <select value={order.orderStatus} onChange={e => updateOrder(order._id, 'orderStatus', e.target.value)} style={styles.select}>
                      {['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Payment Status</label>
                    <select value={order.paymentStatus} onChange={e => updateOrder(order._id, 'paymentStatus', e.target.value)} style={styles.select}>
                      {['pending', 'paid', 'failed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '240px', background: '#1a1a2e', color: '#fff', padding: '24px 0', flexShrink: 0 },
  logo: { fontSize: '1.3rem', fontWeight: 800, padding: '0 24px 24px', borderBottom: '1px solid #333', color: '#e91e8c' },
  nav: { padding: '20px 0' },
  navLink: { display: 'block', padding: '12px 24px', color: '#ccc', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem' },
  main: { flex: 1, padding: '30px', background: '#f5f5f5' },
  title: { fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px', color: '#222' },
  card: { background: '#fff', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', cursor: 'pointer' },
  orderId: { fontWeight: 700, color: '#222' },
  meta: { fontSize: '0.85rem', color: '#999', marginTop: '4px' },
  right: { display: 'flex', alignItems: 'center', gap: '10px' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 },
  chevron: { color: '#999', fontSize: '0.8rem' },
  details: { padding: '0 20px 20px', borderTop: '1px solid #f0f0f0' },
  items: { paddingTop: '16px' },
  item: { display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '0.9rem', color: '#555' },
  address: { background: '#f9f9f9', borderRadius: '8px', padding: '10px 14px', margin: '12px 0', fontSize: '0.85rem', color: '#555' },
  upiTx: { background: '#e8f5e9', borderRadius: '8px', padding: '8px 14px', fontSize: '0.85rem', color: '#2e7d32', marginBottom: '12px' },
  controls: { display: 'flex', gap: '20px', marginTop: '12px' },
  label: { display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#555', marginBottom: '6px' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }
};

export default AdminOrders;
