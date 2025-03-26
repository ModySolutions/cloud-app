// eslint-disable-next-line import/no-unresolved
import { useState, useEffect } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import AuthLinks from '../components/AuthLinks';
import handleRecaptchaVerify from '../../../../scripts/tools/validateRecaptcha';

const ForgotPassword = () => {
	const { email, setEmail, loading, error } = useAuth();
	const [ sendingEmail, setSendingEmail ] = useState( false );
	const [ emailSent, setEmailSent ] = useState( false );
	const [ successMessage, setSuccessMessage ] = useState( '' );
	const [ recaptchaSiteKey ] = useState( App.recaptcha_key );

	const location = useLocation();
	const queryParams = new URLSearchParams( location.search );
	const emailParam = queryParams.get( 'email' );
	// eslint-disable-next-line no-undef
	const emailRef = React.useRef( null );

	useEffect( () => {
		if ( emailParam ) {
			setEmail( emailParam );
		}

		if ( ! email ) {
			emailRef.current.focus();
		}
	}, [ email, emailParam, setEmail ] );

	const handleEmailChange = ( e ) => setEmail( e.target.value );

	const authLinks = (
		<AuthLinks
			leftLink="/auth/sign-in"
			leftText={ __( 'Sign In', 'app' ) }
			rightLink="/auth/sign-up"
			rightText={ __( 'Sign up', 'app' ) }
		/>
	);

	const sendToRecaptcha = ( event ) => {
		event.preventDefault();
		handleRecaptchaVerify( event, handleSubmit, recaptchaSiteKey );
	};

	const handleSubmit = async ( token ) => {
		setSendingEmail( true );

		const userData = {
			email,
			action: 'forgot_password',
			token,
		};

		const data = new URLSearchParams( userData );

		const response = await fetch( App.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: data.toString(),
		} );

		if ( ! response.ok ) {
			toast.error( __( 'Error sending email.', 'app' ), {
				autoClose: 3000,
			} );

			setSendingEmail( false );
		}

		const {
			success,
			data: { message },
		} = await response.json();

		if ( success ) {
			setEmailSent( true );
			setSuccessMessage( message );
			const defaultSuccessMessage = sprintf(
				// eslint-disable-next-line @wordpress/i18n-translator-comments
				__( 'We sent an email to %s.', 'app' ),
				email
			);
			toast.success( successMessage || defaultSuccessMessage, {
				autoClose: 3000,
			} );
		} else {
			setSendingEmail( false );
			toast.error( message || __( 'Error sending email.', 'app' ), {
				autoClose: 3000,
			} );
		}
	};

	if ( loading ) {
		return <div className={ 'loading-icon-primary-2' }></div>;
	}

	if ( error ) {
		return <h2>{ error }</h2>;
	}

	return (
		<>
			{ ! emailSent ? (
				<form
					className={ 'forgot-password' }
					onSubmit={ sendToRecaptcha }
				>
					<div className="form-group">
						<label htmlFor="email">{ __( 'Email', 'app' ) }</label>
						<input
							type="email"
							className="input-lg"
							value={ email }
							id="email"
							disabled={ sendingEmail }
							ref={ emailRef }
							onChange={ handleEmailChange }
						/>
					</div>
					{ authLinks }
					<div className="form-group col-12">
						<button
							type="submit"
							className="btn btn-primary text-white btn-wide d-flex"
							disabled={ sendingEmail || ! email }
						>
							{ sendingEmail && (
								<div className="loading-icon-white-1 mr-2"></div>
							) }
							{ sendingEmail && __( 'Sending email…', 'app' ) }
							{ ! sendingEmail &&
								__( 'Reset my password', 'app' ) }
						</button>
					</div>
				</form>
			) : (
				<>
					<div className="message my-2 p-2 rounded radius-sm is-visible">
						{ successMessage }
					</div>
					{ authLinks }
				</>
			) }
		</>
	);
};

export default ForgotPassword;
