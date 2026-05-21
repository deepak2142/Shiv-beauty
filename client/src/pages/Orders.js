import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../utils/api';

const statusColor = { placed: '#ff9800', confirmed: '#2196f3', shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336' };
const payColor = { pending: '#ff9800', paid: '#4caf50', failed: '#f44336' };

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.center}>Loading orders...</div>;
  if (orders.length === 0) return <div style={styles.center}><p>No orders yet.</p></div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>My Orders</h1>
      {orders.map(order => (
        <div key={order._id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</div>
              <div style={styles.date}>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div style={styles.badges}>
              <span style={{ ...styles.badge, background: statusColor[order.orderStatus] + '22', color: statusColor[order.orderStatus] }}>
                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
              </span>
              <span style={{ ...styles.badge, background: payColor[order.paymentStatus] + '22', color: payColor[order.paymentStatus] }}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>

          <div style={styles.items}>
            {order.items.map((item, i) => (
              <div key={i} style={styles.item}>
                {item.image && <img src={`http://localhost:5000${item.image}`} alt={item.name} style={styles.img} />}
                <div>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemMeta}>Qty: {item.quantity} × ₹{item.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: '#e91e8c', fontWeight: 800 }}>₹{order.totalAmount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px', color: '#222' },
  card: { background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  orderId: { fontWeight: 700, color: '#333' },
  date: { color: '#999', fontSize: '0.85rem', marginTop: '4px' },
  badges: { display: 'flex', gap: '8px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 },
  items: { borderTop: '1px solid #f0f0f0', paddingTop: '16px', marginBottom: '16px' },
  item: { display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' },
  img: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' },
  itemName: { fontWeight: 600, fontSize: '0.9rem', color: '#222' },
  itemMeta: { color: '#999', fontSize: '0.85rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #f0f0f0', paddingTop: '12px' },
  center: { textAlign: 'center', padding: '80px 20px', color: '#999' }
};

export default Orders;
