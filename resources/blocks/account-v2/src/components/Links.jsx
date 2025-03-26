// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';

const Links = ( { routes } ) => {
	const [ currentPath, setCurrentPath ] = useState(
		window.location.pathname
	);
	if ( ! routes || Object.keys( routes ).length === 0 ) {
		return '';
	}

	const navigate = ( event ) => {
		event.preventDefault();
		const link = event.currentTarget.getAttribute( 'href' );
		setCurrentPath( link );
		window.history.pushState( {}, '', link );
		// eslint-disable-next-line no-undef
		window.dispatchEvent( new PopStateEvent( 'popstate' ) );
	};

	const routesEntries = Object.entries( routes ).map(
		( [ key, value ] ) => ( {
			link: key.endsWith( '/' ) ? key : `${ key }/`,
			title: value,
		} )
	);

	return (
		<>
			{ routesEntries.map( ( { link, title } ) => {
				return (
					<a
						href={ link }
						key={ link }
						onClick={ navigate }
						className={ `link${
							currentPath === link ? ' active' : ''
						}` }
					>
						{ title }
					</a>
				);
			} ) }
		</>
	);
};

export default Links;
