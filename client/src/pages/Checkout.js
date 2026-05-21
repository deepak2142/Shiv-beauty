import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiTxId, setUpiTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleOrder = async () => {
    const { name, phone, address, city, pincode } = form;
    if (!name || !phone || !address || !city || !pincode) {
      return toast.error('Please fill in all shipping details');
    }
    setLoading(true);
    try {
      await placeOrder({
        items: cart.map(i => ({ product: i._id, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: form,
        upiTransactionId: upiTxId
      });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const upiLink = `upi://pay?pa=77424779950&pn=ShivBeautyCenter&am=${total}&tn=ShivBeautyOrder`;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Checkout</h1>
      <div style={styles.layout}>
        {/* Shipping Form */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Shipping Details</h2>
          {['name', 'phone', 'address', 'city', 'pincode'].map(field => (
            <div key={field} style={styles.field}>
              <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                style={styles.input}
                placeholder={field === 'address' ? 'Full address' : ''}
              />
            </div>
          ))}

          <h2 style={{ ...styles.sectionTitle, marginTop: '30px' }}>Payment Method</h2>
          <div style={styles.payOptions}>
            {[['upi', '📲 UPI Payment'], ['whatsapp', '💬 WhatsApp + UPI'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
              <label key={val} style={{ ...styles.payOption, border: paymentMethod === val ? '2px solid #e91e8c' : '2px solid #eee' }}>
                <input type="radio" name="payment" value={val} checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} style={{ marginRight: '8px' }} />
                {label}
              </label>
            ))}
          </div>

          {paymentMethod === 'upi' && (
            <div style={styles.upiBox}>
              <p style={styles.upiId}>UPI ID: <strong>7742479950</strong></p>
              <a href={upiLink} style={styles.upiBtn}>Open UPI App to Pay ₹{total}</a>
              <div style={styles.field}>
                <label style={styles.label}>Enter UPI Transaction ID after payment</label>
                <input value={upiTxId} onChange={e => setUpiTxId(e.target.value)} style={styles.input} placeholder="e.g. 4085xxxxxxxxxxxx" />
              </div>
            </div>
          )}

          {paymentMethod === 'whatsapp' && (
            <div style={styles.upiBox}>
              <p>Pay on WhatsApp and confirm your order with the merchant.</p>
              <a
                href={`https://wa.me/7742479950?text=${encodeURIComponent(`Hi! I've placed an order for ₹${total}. Please share payment details.`)}`}
                target="_blank"
                rel="noreferrer"
                style={styles.waBtn}
              >
                Open WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          {cart.map(item => (
            <div key={item._id} style={styles.orderItem}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.discountedPrice || item.price) * item.quantity}</span>
            </div>
          ))}
          <div style={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: '#e91e8c', fontWeight: 800 }}>₹{total}</span>
          </div>
          <button style={styles.placeBtn} onClick={handleOrder} disabled={loading}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  title: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '30px', color: '#222' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  section: { flex: 2 },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', color: '#333' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '0.9rem', color: '#555' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
  payOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  payOption: { display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 500 },
  upiBox: { background: '#fff8f9', border: '1px solid #fce4ec', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  upiId: { marginBottom: '12px' },
  upiBtn: { display: 'block', background: '#e91e8c', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, marginBottom: '16px' },
  waBtn: { display: 'block', background: '#25d366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 },
  summary: { flex: 1, background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', height: 'fit-content' },
  orderItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#555', fontSize: '0.9rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '12px' },
  placeBtn: { width: '100%', background: '#e91e8c', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '20px' }
};

export default Checkout;
