import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const imageUrl = product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/products/${product._id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img src={imageUrl} alt={product.name} style={styles.image} />
        {product.discountPercent > 0 && (
          <span style={styles.badge}>{product.discountPercent}% OFF</span>
        )}
      </div>
      <div style={styles.info}>
        <p style={styles.category}>{product.category}</p>
        <h3 style={styles.name}>{product.name}</h3>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.discountedPrice || product.price}</span>
          {product.discountPercent > 0 && (
            <span style={styles.originalPrice}>₹{product.price}</span>
          )}
        </div>
        <button style={styles.btn} onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </Link>
  );
};

const styles = {
  card: { display: 'block', background: '#fff', borderRadius: '12px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  imageWrap: { position: 'relative', paddingTop: '100%', background: '#f5f5f5' },
  image: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  badge: { position: 'absolute', top: '10px', left: '10px', background: '#e91e8c', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' },
  info: { padding: '14px' },
  category: { fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' },
  name: { fontSize: '0.95rem', fontWeight: 600, color: '#222', margin: '0 0 8px', lineHeight: 1.3 },
  priceRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  price: { fontSize: '1.1rem', fontWeight: 700, color: '#e91e8c' },
  originalPrice: { fontSize: '0.85rem', color: '#aaa', textDecoration: 'line-through' },
  btn: { width: '100%', background: '#e91e8c', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }
};

export default ProductCard;
