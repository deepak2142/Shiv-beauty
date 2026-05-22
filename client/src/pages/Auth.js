import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// ====================== LOGIN + REGISTER ======================

export const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await loginUser(form);

      // ✅ FIXED STORAGE
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.user);

      toast.success(`Welcome back, ${res.data.user.name}!`);

      navigate(res.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌸 Welcome Back</h1>
        <p style={styles.sub}>Login to your Shiv Beauty account</p>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.switch}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

// ====================== REGISTER ======================

export const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Name, email and password required");

    setLoading(true);
    try {
      const res = await registerUser(form);

      // ✅ FIXED STORAGE
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(res.data.user);

      toast.success(`Welcome, ${res.data.user.name}! 🎉`);

      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌸 Create Account</h1>
        <p style={styles.sub}>Join Shiv Beauty today</p>

        <input
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button style={styles.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p style={styles.switch}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// ====================== STYLES ======================

const styles = {
  page: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 20px",
    background: "#fff8f9",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 30px rgba(233,30,140,0.12)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#c2185b",
    textAlign: "center",
  },
  sub: {
    color: "#999",
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "12px",
    border: "1px solid #eee",
    borderRadius: "10px",
    background: "#fafafa",
  },
  btn: {
    width: "100%",
    background: "#e91e8c",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  switch: {
    textAlign: "center",
    marginTop: "16px",
    color: "#777",
  },
  link: {
    color: "#e91e8c",
    fontWeight: 700,
    textDecoration: "none",
  },
};