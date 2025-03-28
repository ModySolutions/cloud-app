// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useUser } from '../context/AccountContext';
import { toast } from 'react-toastify';

const Settings = () => {
	const { user, setUser, loading, error } = useUser();
	const [ userId, setUserId ] = useState( null );
	const [ optInUpdates, setOptInUpdates ] = useState( false );
	const [ optInCommercial, setOptInCommercial ] = useState( false );
	const [ preferredLanguage, setPreferredLanguage ] = useState( 'ES' );
	const [ updating, setUpdating ] = useState( false );

	if ( ! userId && null !== user ) {
		setUserId( user?.id );
		setOptInUpdates( user?.opt_in_updates );
		setOptInCommercial( user?.opt_in_commercial );
		setPreferredLanguage( user?.preferred_language );
	}

	const handleOptInUpdatesChange = ( e ) =>
		setOptInUpdates( e.target.checked );
	const handleOptInCommercialChange = ( e ) =>
		setOptInCommercial( e.target.checked );
	const handlePreferredLanguageChange = ( e ) =>
		setPreferredLanguage( e.target.value );

	const handleSubmit = ( e ) => {
		e.preventDefault();
		setUpdating( true );

		const userData = {
			user_id: userId,
			opt_in_updates: optInUpdates,
			opt_in_commercial: optInCommercial,
			preferred_language: preferredLanguage,
		};

		apiFetch( {
			path: '/app/v1/update-account-settings/',
			method: 'POST',
			data: userData,
		} )
			.then( ( response ) => {
				setUser( ( prevUser ) => ( { ...prevUser, ...userData } ) );
				setUpdating( false );
				if ( response.success ) {
					toast.success(
						response.message ||
							__( 'User settings updated successfully.', 'app' ),
						{
							autoClose: 3000,
						}
					);
				} else {
					toast.error(
						response.message ||
							__( 'Error updating user settings.', 'app' ),
						{
							autoClose: 3000,
						}
					);
				}
			} )
			.catch( () => {
				toast.error( __( 'Error updating user settings.', 'app' ), {
					autoClose: 10000,
				} );
				setUpdating( false );
			} );
	};

	if ( loading ) {
		return <div className={ 'loading-icon-primary-2' }></div>;
	}

	if ( error ) {
		return <h2>{ error }</h2>;
	}

	return (
		<>
			{ user ? (
				<form className={ 'container' } onSubmit={ handleSubmit }>
					<div className="col-6">
						<h3>{ __( 'Notifications' ) }</h3>
					</div>
					<div className="col-6 justify-end items-start p-relative">
						{ updating && (
							<div className="loading-icon-primary-2 p-absolute top right"></div>
						) }
					</div>
					<div className="form-group col-12 flex">
						<input
							type="checkbox"
							id="opt-in-updates"
							checked={ optInUpdates }
							disabled={ updating }
							className={ 'mr-2' }
							onChange={ handleOptInUpdatesChange }
						/>
						<label htmlFor="opt-in-updates" className={ '' }>
							{ __(
								'Get update notifications from Mody Cloud',
								'app'
							) }
						</label>
					</div>
					<div className="form-group col-12 ">
						<input
							type="checkbox"
							id="opt-in-commercial"
							checked={ optInCommercial }
							disabled={ updating }
							className={ 'mr-2' }
							onChange={ handleOptInCommercialChange }
						/>
						<label htmlFor="opt-in-commercial" className={ '' }>
							{ __(
								'Get commercial notifications for new products or features',
								'app'
							) }
						</label>
					</div>
					<hr className="my-3 col-12" />
					<h3>{ __( 'Localization' ) }</h3>
					<div className="form-group col-12">
						<label htmlFor="preferred-language">
							{ __( 'Preferred language', 'app' ) }
						</label>
						<select
							id="preferred-language"
							value={ preferredLanguage }
							disabled={ updating }
							onChange={ handlePreferredLanguageChange }
							className="input-lg"
						>
							<option value="es_ES">{ __( 'Spanish' ) }</option>
							<option value="en_US">{ __( 'English' ) }</option>
						</select>
					</div>
					<div className="form-group col-12">
						<button
							type="submit"
							className="btn btn-primary text-white"
							disabled={ updating }
						>
							{ __( 'Save settings', 'app' ) }
						</button>
					</div>
				</form>
			) : (
				<p>{ __( 'Settings not found', 'app' ) }</p>
			) }
		</>
	);
};

export default Settings;
