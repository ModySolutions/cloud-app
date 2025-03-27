// eslint-disable-next-line import/no-unresolved
import React from 'react';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SignIn from './src/components/SignIn';
import SignUp from './src/components/SignUp';
import SignOut from './src/components/SignOut';
import ForgotPassword from './src/components/ForgotPassword';
import ResetPassword from './src/components/ResetPassword';
import { AuthProvider } from './src/AuthContext';

const AuthContainer = () => {
	return (
		<div>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/auth/sign-in" element={ <SignIn /> } />
						<Route path="/auth/sign-up" element={ <SignUp /> } />
						<Route path="/auth/sign-out" element={ <SignOut /> } />
						<Route
							path="/auth/forgot-passwd"
							element={ <ForgotPassword /> }
						/>
						<Route
							path="/auth/reset-passwd"
							element={ <ResetPassword /> }
						/>
					</Routes>
				</BrowserRouter>
				<ToastContainer draggable />
			</AuthProvider>
		</div>
	);
};

domReady( () => {
	const root = createRoot( document.getElementById( 'app-auth-container' ) );

	root.render( <AuthContainer /> );
} );
