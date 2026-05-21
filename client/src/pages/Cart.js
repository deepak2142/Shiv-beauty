import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🛒</div>
      <h2>Your cart is empty</h2>
      <Link to="/products" style={styles.shopBtn}>Start Shopping</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Shopping Cart</h1>
      <div style={styles.layout}>
        <div style={styles.items}>
          {cart.map(item => {
            const imgUrl = item.images?.[0]
              ? `http://localhost:5000${item.images[0]}`
              : 'https://via.placeholder.com/80x80?text=Img';
            return (
              <div key={item._id} style={styles.item}>
                <img src={imgUrl} alt={item.name} style={styles.img} />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>₹{item.discountedPrice || item.price}</p>
                </div>
                <div style={styles.qtyRow}>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                  <span style={styles.qtyNum}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <div style={styles.subtotal}>₹{(item.discountedPrice || item.price) * item.quantity}</div>
                <button style={styles.removeBtn} onClick={() => removeFromCart(item._id)}>✕</button>
              </div>
            );
          })}
        </div>

        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span>Subtotal</span><span>₹{total}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span><span style={{ color: '#4caf50' }}>FREE</span>
          </div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #eee', paddingTop: '12px' }}>
            <span>Total</span><span style={{ color: '#e91e8c' }}>₹{total}</span>
          </div>
          <button
            style={styles.checkoutBtn}
            onClick={() => user ? navigate('/checkout') : navigate('/login')}
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>

          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'd like to order:\n${cart.map(i => `${i.name} x${i.quantity} = ₹${(i.discountedPrice || i.price) * i.quantity}`).join('\n')}\nTotal: ₹${total}`)}`}
            target="_blank"
            rel="noreferrer"
            style={styles.waBtn}
          >
            💬 Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px', color: '#222' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  items: { flex: 2 },
  item: { display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  img: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#222' },
  itemPrice: { color: '#e91e8c', fontWeight: 700, margin: 0 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontWeight: 700 },
  qtyNum: { fontWeight: 700, minWidth: '24px', textAlign: 'center' },
  subtotal: { fontWeight: 700, minWidth: '70px', textAlign: 'right', color: '#222' },
  removeBtn: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1rem' },
  summary: { flex: 1, background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' },
  summaryTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#222' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555' },
  checkoutBtn: { width: '100%', background: '#e91e8c', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '16px' },
  waBtn: { display: 'block', background: '#25d366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, marginTop: '12px' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: '4rem', marginBottom: '16px' },
  shopBtn: { display: 'inline-block', background: '#e91e8c', color: '#fff', padding: '12px 30px', borderRadius: '24px', textDecoration: 'none', fontWeight: 700, marginTop: '16px' }
};

export default Cart;
