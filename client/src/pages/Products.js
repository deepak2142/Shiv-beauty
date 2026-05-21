import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../utils/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ search, category, sort })
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, category, sort]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <h3 style={styles.filterTitle}>Filters</h3>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Category</label>
          <select style={styles.select} value={category} onChange={e => setParam('category', e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Sort By</label>
          <select style={styles.select} value={sort} onChange={e => setParam('sort', e.target.value)}>
            <option value="">Latest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {(category || sort) && (
          <button style={styles.clearBtn} onClick={() => setSearchParams({})}>Clear Filters</button>
        )}
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <input
            style={styles.searchInput}
            placeholder="Search products..."
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
          <span style={styles.count}>{products.length} product{products.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={styles.empty}>No products found. Try different filters.</div>
        ) : (
          <div style={styles.grid}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', display: 'flex', gap: '30px' },
  sidebar: { width: '220px', flexShrink: 0 },
  filterTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#222' },
  filterGroup: { marginBottom: '20px' },
  filterLabel: { display: 'block', fontWeight: 600, marginBottom: '8px', color: '#555', fontSize: '0.9rem' },
  select: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  clearBtn: { background: 'none', border: '1px solid #e91e8c', color: '#e91e8c', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, width: '100%' },
  main: { flex: 1 },
  topBar: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' },
  searchInput: { flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: '24px', fontSize: '0.95rem', outline: 'none' },
  count: { color: '#999', fontSize: '0.9rem', whiteSpace: 'nowrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  loading: { textAlign: 'center', padding: '60px', color: '#999' },
  empty: { textAlign: 'center', padding: '60px', color: '#999' }
};

export default Products;
