import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getProducts().then(res => setFeatured(res.data.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>✨ Shiv Beauty Center</h1>
          <p style={styles.heroSub}>Premium beauty products & cosmetics at your fingertips</p>
          <Link to="/products" style={styles.heroBtn}>Shop Now →</Link>
        </div>
      </div>

      {/* Categories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Shop by Category</h2>
        <div style={styles.categoryGrid}>
          {['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Nail Care', 'Tools'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} style={styles.categoryCard}>
              <span style={styles.categoryEmoji}>
                {cat === 'Skincare' ? '🧴' : cat === 'Makeup' ? '💄' : cat === 'Haircare' ? '💆' : cat === 'Fragrance' ? '🌸' : cat === 'Nail Care' ? '💅' : '🪮'}
              </span>
              <span style={styles.categoryName}>{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" style={styles.viewAll}>View All →</Link>
        </div>
        <div style={styles.productGrid}>
          {featured.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
        {featured.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No products yet. Check back soon!</p>}
      </section>

      {/* UPI / WhatsApp CTA */}
      <section style={styles.paySection}>
        <div style={styles.payCard}>
          <h3>💬 Order via WhatsApp</h3>
          <p>Chat directly with us to order, ask questions, and pay through UPI scanner</p>
          <a
            href={`https://wa.me/7742479950?text=Hi, I'd like to order from Shiv Beauty Center`}
            target="_blank"
            rel="noreferrer"
            style={styles.waBtn}
          >
            Chat on WhatsApp
          </a>
        </div>
        <div style={styles.payCard}>
          <h3>📲 Quick UPI Payment</h3>
          <p>Pay instantly using any UPI app — GPay, PhonePe, Paytm</p>
          <div style={styles.upiId}>UPI ID: 7742479950</div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: { background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #e91e8c22 100%)', padding: '80px 20px', textAlign: 'center' },
  heroContent: { maxWidth: '600px', margin: '0 auto' },
  heroTitle: { fontSize: '2.8rem', fontWeight: 800, color: '#c2185b', margin: '0 0 16px' },
  heroSub: { fontSize: '1.15rem', color: '#555', margin: '0 0 32px' },
  heroBtn: { background: '#e91e8c', color: '#fff', padding: '14px 36px', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '1.05rem' },
  section: { maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  sectionTitle: { fontSize: '1.6rem', fontWeight: 700, color: '#222', margin: 0 },
  viewAll: { color: '#e91e8c', textDecoration: 'none', fontWeight: 600 },
  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' },
  categoryCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', background: '#fff', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'transform 0.2s' },
  categoryEmoji: { fontSize: '2rem', marginBottom: '10px' },
  categoryName: { fontWeight: 600, color: '#333', fontSize: '0.9rem' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  paySection: { background: '#fff8f9', padding: '50px 20px', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
  payCard: { background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '320px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  waBtn: { display: 'inline-block', background: '#25d366', color: '#fff', padding: '12px 28px', borderRadius: '24px', textDecoration: 'none', fontWeight: 700, marginTop: '16px' },
  upiId: { background: '#f5f5f5', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, marginTop: '16px', fontSize: '1rem', color: '#e91e8c' }
};

export default Home;
