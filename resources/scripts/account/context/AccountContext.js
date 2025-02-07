import React, { createContext, useState, useContext, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';

const AccountContext = createContext(null);

export const AccountProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch({ path: '/wp/v2/users/me' })
            .then(userData => {
                setUser(userData);
                setLoading(false);
            })
            .catch(error => {
                setError('Could not fetch user data');
                setLoading(false);
            });
    }, []);

    return (
        <AccountContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useUser = () => {
    return useContext(AccountContext);
};
