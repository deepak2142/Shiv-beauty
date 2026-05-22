import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadUser = () => {
      try {

        const storedUser = localStorage.getItem('shiv_user');

        if (storedUser && storedUser !== 'undefined') {

          const parsedUser = JSON.parse(storedUser);

          setUser(parsedUser);

          if (parsedUser?.token) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${parsedUser.token}`;
          }

        }

      } catch (error) {

        console.error('Invalid user data in localStorage:', error);

        localStorage.removeItem('shiv_user');

        setUser(null);

      } finally {

        setLoading(false);

      }
    };

    loadUser();

  }, []);

  const login = (userData) => {

    try {

      setUser(userData);

      localStorage.setItem(
        'shiv_user',
        JSON.stringify(userData)
      );

      if (userData?.token) {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${userData.token}`;
      }

    } catch (error) {

      console.error('Login storage error:', error);

    }

  };

  const logout = () => {

    setUser(null);

    localStorage.removeItem('shiv_user');

    delete axios.defaults.headers.common['Authorization'];

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);