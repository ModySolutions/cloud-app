// eslint-disable-next-line import/no-unresolved
import React from 'react';
import domReady from '@wordpress/dom-ready';
import { createRoot } from '@wordpress/element';
import { ToastContainer } from 'react-toastify';
import CreateSiteIntro from './site/components/CreateSiteIntro';
import CreateSiteForm from './site/components/CreateSiteForm';

const AccountContainer = () => {
	return (
		<>
			<CreateSiteIntro />
			<CreateSiteForm />
			<ToastContainer draggable />
		</>
	);
};

domReady( () => {
	const root = createRoot(
		document.getElementById( 'app-create-site-container' )
	);

	root.render( <AccountContainer /> );
} );
