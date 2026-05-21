import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🌸 Shiv Beauty
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" style={styles.link}>My Orders</Link>
              {user.role === 'admin' && <Link to="/admin" style={{ ...styles.link, color: '#e91e8c' }}>Admin</Link>}
              <span style={styles.link} onClick={handleLogout}>Logout ({user.name})</span>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
          <Link to="/cart" style={styles.cartBtn}>
            🛒 {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
          </Link>
        </div>

        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cart ({itemCount})</Link>
          {user ? (
            <>
              <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>
              {user.role === 'admin' && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
              <span style={styles.mobileLink} onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</span>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' },
  logo: { fontSize: '1.4rem', fontWeight: 700, color: '#e91e8c', textDecoration: 'none' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '24px', '@media(max-width:768px)': { display: 'none' } },
  link: { color: '#333', textDecoration: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 },
  signupBtn: { background: '#e91e8c', color: '#fff', padding: '8px 16px', borderRadius: '20px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' },
  cartBtn: { fontSize: '1.2rem', textDecoration: 'none', position: 'relative' },
  badge: { background: '#e91e8c', color: '#fff', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '10px', position: 'absolute', top: '-8px', right: '-8px' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  mobileMenu: { display: 'flex', flexDirection: 'column', padding: '16px 20px', background: '#fff', borderTop: '1px solid #eee' },
  mobileLink: { padding: '10px 0', color: '#333', textDecoration: 'none', fontSize: '1rem', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }
};

export default Navbar;
