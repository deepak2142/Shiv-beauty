import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminGetProducts, adminDeleteProduct, adminAddProduct, adminUpdateProduct } from '../../utils/api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', description: '', price: '', discountPercent: '0', category: '', brand: '', stock: '', tags: '', whatsappNumber: '', isActive: 'true' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => adminGetProducts().then(r => setProducts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    images.forEach(img => data.append('images', img));

    try {
      if (editing) {
        await adminUpdateProduct(editing._id, data);
        toast.success('Product updated!');
      } else {
        await adminAddProduct(data);
        toast.success('Product added!');
      }
      setShowForm(false); setEditing(null); setForm(emptyForm); setImages([]);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, discountPercent: p.discountPercent, category: p.category, brand: p.brand || '', stock: p.stock, tags: p.tags?.join(', ') || '', whatsappNumber: p.whatsappNumber || '', isActive: p.isActive ? 'true' : 'false' });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await adminDeleteProduct(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🌸 Shiv Admin</div>
        <nav style={styles.nav}>
          <Link to="/admin" style={styles.navLink}>📊 Dashboard</Link>
          <Link to="/admin/products" style={{ ...styles.navLink, background: '#e91e8c22', color: '#e91e8c' }}>📦 Products</Link>
          <Link to="/admin/orders" style={styles.navLink}>🛒 Orders</Link>
          <Link to="/" style={styles.navLink}>🌐 View Site</Link>
        </nav>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>Products</h1>
          <button style={styles.addBtn} onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}>+ Add Product</button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={styles.modal}>
            <div style={styles.modalCard}>
              <h2 style={styles.modalTitle}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <div style={styles.formGrid}>
                {[['name', 'Product Name'], ['category', 'Category'], ['brand', 'Brand'], ['price', 'Price (₹)'], ['discountPercent', 'Discount %'], ['stock', 'Stock'], ['tags', 'Tags (comma separated)'], ['whatsappNumber', 'WhatsApp Number']].map(([key, label]) => (
                  <div key={key} style={styles.field}>
                    <label style={styles.label}>{label}</label>
                    <input name={key} value={form[key]} onChange={handleChange} style={styles.input} />
                  </div>
                ))}
                <div style={{ ...styles.field, gridColumn: '1/-1' }}>
                  <label style={styles.label}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} style={{ ...styles.input, height: '80px', resize: 'vertical' }} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Status</label>
                  <select name="isActive" value={form.isActive} onChange={handleChange} style={styles.input}>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div style={{ ...styles.field, gridColumn: '1/-1' }}>
                  <label style={styles.label}>Product Images (up to 6)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} style={styles.input} />
                  {images.length > 0 && <p style={styles.imgCount}>{images.length} image(s) selected</p>}
                  {editing && editing.images?.length > 0 && (
                    <div style={styles.existingImgs}>
                      {editing.images.map((img, i) => <img key={i} src={`http://localhost:5000${img}`} alt="" style={styles.thumb} />)}
                      <p style={styles.imgNote}>New images will replace existing ones unless you check "Keep existing"</p>
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.formActions}>
                <button style={styles.cancelBtn} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                <button style={styles.saveBtn} onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Status</span><span>Actions</span>
          </div>
          {products.map(p => (
            <div key={p._id} style={styles.tableRow}>
              <div style={styles.productCell}>
                {p.images?.[0] && <img src={`http://localhost:5000${p.images[0]}`} alt="" style={styles.rowImg} />}
                <span style={styles.productName}>{p.name}</span>
              </div>
              <span>{p.category}</span>
              <span>₹{p.discountedPrice || p.price}{p.discountPercent > 0 && <small style={{ color: '#e91e8c' }}> (-{p.discountPercent}%)</small>}</span>
              <span>{p.stock}</span>
              <span style={{ color: p.isActive ? '#4caf50' : '#f44336', fontWeight: 600 }}>{p.isActive ? 'Active' : 'Inactive'}</span>
              <span>
                <button style={styles.editBtn} onClick={() => handleEdit(p)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: '#222', margin: 0 },
  addBtn: { background: '#e91e8c', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalCard: { background: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '24px', color: '#222' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column' },
  label: { fontWeight: 600, marginBottom: '6px', fontSize: '0.85rem', color: '#555' },
  input: { padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' },
  imgCount: { color: '#e91e8c', fontSize: '0.85rem', marginTop: '6px' },
  existingImgs: { marginTop: '12px' },
  thumb: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginRight: '8px' },
  imgNote: { fontSize: '0.8rem', color: '#999', marginTop: '8px' },
  formActions: { display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 24px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontWeight: 600 },
  saveBtn: { padding: '10px 24px', background: '#e91e8c', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' },
  table: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 0.7fr 1fr', padding: '14px 20px', background: '#f9f9f9', fontWeight: 700, fontSize: '0.85rem', color: '#555', gap: '10px' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr 0.7fr 1fr', padding: '14px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center', fontSize: '0.9rem', color: '#333', gap: '10px' },
  productCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  rowImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' },
  productName: { fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  editBtn: { background: '#2196f322', color: '#2196f3', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, marginRight: '6px', fontSize: '0.85rem' },
  deleteBtn: { background: '#f4433622', color: '#f44336', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }
};

export default AdminProducts;
