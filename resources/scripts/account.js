// eslint-disable-next-line import/no-unresolved
import React from 'react';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Account from './account/views/Account';
import Settings from './account/views/Settings';
import Security from './account/views/Security';
import Links from './account/components/Links';
import { AccountProvider } from './account/context/AccountContext';
import { ToastContainer } from 'react-toastify';

const AccountContainer = () => {
	return (
		<div>
			<AccountProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/account" element={ <Account /> } />
						<Route
							path="/account/settings"
							element={ <Settings /> }
						/>
						<Route
							path="/account/security"
							element={ <Security /> }
						/>
					</Routes>
				</BrowserRouter>
				<ToastContainer draggable position="bottom-right" />
			</AccountProvider>
		</div>
	);
};

domReady( () => {
	const root = createRoot(
		document.getElementById( 'app-account-container' )
	);

	root.render( <AccountContainer /> );

	const accountPage = new wp.api.models.Page( { id: App.account_page_id } );
	accountPage.fetch().done( ( post ) => {
		if ( post.routes ) {
			const nav = createRoot(
				document.getElementById( 'dynamic-sidebar-nav' )
			);
			nav.render( <Links routes={ post.routes } /> );
		}
	} );
} );
