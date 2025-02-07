import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const location = window.location.search;
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const queryParams = new URLSearchParams(location.search)
    const emailParam = queryParams.get('email') || null;
    if(emailParam) {
        setEmail(emailParam);
    }

    return (
        <AuthContext.Provider value={{ email, setEmail, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const navigate = (event) => {
    event.preventDefault();
    const link = event.currentTarget.getAttribute('href');
    window.history.pushState({}, '', link);
    window.dispatchEvent(new PopStateEvent('popstate'));
}