import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../utils/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getProduct(id).then(r => setProduct(r.data)).catch(() => navigate('/products'));
  }, [id, navigate]);

  if (!product) return <div style={styles.loading}>Loading...</div>;

  const images = product.images?.length > 0
    ? product.images.map(img => `http://localhost:5000${img}`)
    : ['https://via.placeholder.com/500x500?text=No+Image'];

  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in: ${product.name} (₹${product.discountedPrice || product.price}). Please share details.`);
  const whatsappUrl = `https://wa.me/${product.whatsappNumber || '7742479950'}?text=${whatsappMsg}`;

  const handleBuy = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Image Gallery */}
        <div style={styles.gallery}>
          <img src={images[selectedImg]} alt={product.name} style={styles.mainImage} />
          {images.length > 1 && (
            <div style={styles.thumbs}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`view ${i + 1}`}
                  style={{ ...styles.thumb, border: i === selectedImg ? '2px solid #e91e8c' : '2px solid #eee' }}
                  onClick={() => setSelectedImg(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={styles.info}>
          <p style={styles.category}>{product.category} {product.brand ? `• ${product.brand}` : ''}</p>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={styles.priceRow}>
            <span style={styles.price}>₹{product.discountedPrice || product.price}</span>
            {product.discountPercent > 0 && (
              <>
                <span style={styles.originalPrice}>₹{product.price}</span>
                <span style={styles.badge}>{product.discountPercent}% OFF</span>
              </>
            )}
          </div>

          <p style={styles.desc}>{product.description}</p>

          <div style={styles.stockRow}>
            {product.stock > 0
              ? <span style={{ color: '#4caf50', fontWeight: 600 }}>✓ In Stock ({product.stock} units)</span>
              : <span style={{ color: '#f44336', fontWeight: 600 }}>✗ Out of Stock</span>}
          </div>

          {/* Quantity */}
          <div style={styles.qtyRow}>
            <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span style={styles.qty}>{qty}</span>
            <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              style={styles.addCartBtn}
              onClick={() => { addToCart(product, qty); toast.success('Added to cart!'); }}
              disabled={product.stock === 0}
            >
              🛒 Add to Cart
            </button>
            <button style={styles.buyBtn} onClick={handleBuy} disabled={product.stock === 0}>
              Buy Now
            </button>
          </div>

          {/* WhatsApp */}
          <a href={whatsappUrl} target="_blank" rel="noreferrer" style={styles.waBtn}>
            💬 Order via WhatsApp
          </a>

          {/* UPI */}
          <div style={styles.upiBox}>
            <p style={styles.upiTitle}>📲 Pay via UPI</p>
            <p style={styles.upiId}>7742479950</p>
            <p style={styles.upiNote}>Send payment screenshot on WhatsApp after order</p>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div style={styles.tags}>
              {product.tags.map(tag => <span key={tag} style={styles.tag}>#{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '30px 20px' },
  container: { maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '50px', flexWrap: 'wrap' },
  loading: { textAlign: 'center', padding: '80px', color: '#999' },
  gallery: { flex: '0 0 480px', maxWidth: '100%' },
  mainImage: { width: '100%', height: '480px', objectFit: 'cover', borderRadius: '16px', background: '#f5f5f5' },
  thumbs: { display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' },
  thumb: { width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' },
  info: { flex: 1, minWidth: '300px' },
  category: { color: '#999', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' },
  name: { fontSize: '1.8rem', fontWeight: 800, color: '#222', marginBottom: '16px', lineHeight: 1.2 },
  priceRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  price: { fontSize: '1.8rem', fontWeight: 800, color: '#e91e8c' },
  originalPrice: { fontSize: '1.1rem', color: '#aaa', textDecoration: 'line-through' },
  badge: { background: '#e91e8c', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 },
  desc: { color: '#555', lineHeight: 1.7, marginBottom: '20px' },
  stockRow: { marginBottom: '20px' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  qtyBtn: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #e91e8c', background: '#fff', color: '#e91e8c', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 700 },
  qty: { fontSize: '1.1rem', fontWeight: 700, minWidth: '30px', textAlign: 'center' },
  actions: { display: 'flex', gap: '12px', marginBottom: '16px' },
  addCartBtn: { flex: 1, padding: '14px', border: '2px solid #e91e8c', background: '#fff', color: '#e91e8c', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  buyBtn: { flex: 1, padding: '14px', background: '#e91e8c', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  waBtn: { display: 'block', background: '#25d366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, marginBottom: '16px' },
  upiBox: { background: '#fff8f9', border: '1px solid #fce4ec', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' },
  upiTitle: { fontWeight: 700, color: '#555', margin: '0 0 6px' },
  upiId: { fontSize: '1.1rem', fontWeight: 800, color: '#e91e8c', margin: '0 0 6px' },
  upiNote: { fontSize: '0.8rem', color: '#999', margin: 0 },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { background: '#f5f5f5', color: '#666', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }
};

export default ProductDetail;
