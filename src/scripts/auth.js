import React from 'react';
import domReady from '@wordpress/dom-ready';
import {createRoot} from '@wordpress/element';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import SignIn from "./auth/components/SignIn";
import SignUp from "./auth/components/SignUp";
import ForgotPassword from "./auth/components/ForgotPassword";
import ResetPassword from "./auth/components/ResetPassword";
import {AuthProvider} from "./auth/AuthContext";

const AuthContainer = () => {
    return (
        <div>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/auth/sign-in" element={<SignIn/>}/>
                        <Route path="/auth/sign-up" element={<SignUp/>}/>
                        <Route path="/auth/forgot-passwd" element={<ForgotPassword/>}/>
                        <Route path="/auth/reset-passwd" element={<ResetPassword/>}/>
                    </Routes>
                </BrowserRouter>
                <ToastContainer draggable />
            </AuthProvider>
        </div>
    )
}

domReady(() => {
    const root = createRoot(
        document.getElementById('app-auth-container')
    );

    root.render(<AuthContainer/>);
});