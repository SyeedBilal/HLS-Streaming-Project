// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({ loggedIn: false });

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, loggedIn: false });

  
  useEffect(() => {
    
    fetch('http://localhost:3000/api/auth/user', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setAuth({ loading: false, ...data }))
      .catch(() => setAuth({ loading: false, loggedIn: false }));
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth }}>
    {!auth.loading && children}
  </AuthContext.Provider>;
};