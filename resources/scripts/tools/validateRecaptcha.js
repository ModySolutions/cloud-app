import { toast } from 'react-toastify';
import { __ } from '@wordpress/i18n';

const handleRecaptchaVerify = ( event, callback, recaptchaSiteKey ) => {
	event.preventDefault();

	if ( ! window?.grecaptcha ) {
		callback( null ).then( () => {} );
	} else {
		window.grecaptcha.ready( () => {
			window.grecaptcha
				.execute( recaptchaSiteKey, { action: 'submit' } )
				.then( ( token ) => {
					if ( ! token ) {
						toast.error( __( 'Error signing in.', 'app' ), {
							autoClose: 3000,
						} );
						return;
					}

					callback( token ).then( () => {} );
				} );
		} );
	}
};

export default handleRecaptchaVerify;
