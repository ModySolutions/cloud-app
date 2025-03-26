export const navigate = ( event ) => {
	event.preventDefault();
	const link = event.currentTarget.getAttribute( 'href' );
	window.history.pushState( {}, '', link );
	// eslint-disable-next-line no-undef
	window.dispatchEvent( new PopStateEvent( 'popstate' ) );
};
