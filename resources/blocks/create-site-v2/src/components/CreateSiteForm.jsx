// eslint-disable-next-line import/no-unresolved
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import toKebabCase from '../../../../scripts/tools/kebabcase';

const CreateSiteForm = () => {
	const [ companyName, setCompanyName ] = useState( '' );
	const [ spaceName, setSpaceName ] = useState( '' );
	const [ isCreating, setIsCreating ] = useState( false );
	const [ loadingMessage, setLoadingMessage ] = useState(
		'We are creating your space, please wait...'
	);

	const maskSpaceNameInput = ( event ) => {
		setSpaceName( toKebabCase( event.target.value ).substring( 0, 24 ) );
	};

	const handleCompanyName = ( event ) => {
		setCompanyName( event.target.value );
	};
	const handleSpaceName = ( event ) => setSpaceName( event.target.value );

	const messages = [
		__( 'Chopping some bananas…', 'app' ),
		__( 'Grabbing oranges from the tree…', 'app' ),
		__( 'Measuring a cup of flour…', 'app' ),
		__( 'Making sure everything is correct…', 'app' ),
		__( 'Were not we doing a cake?…', 'app' ),
		__( "Huh! It's been a long time…", 'app' ),
		__( 'I got somewhere to be man…', 'app' ),
		__( "Oh! You're still here? Man what am I doing…", 'app' ),
	];

	const checkInstallFinished = async ( queueUi ) => {
		const data = new URLSearchParams( {
			action: 'check_setup_finished',
			queue_id: queueUi,
		} );

		try {
			const response = await fetch( App.ajax_url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: data.toString(),
			} );
			if ( ! response.ok ) {
				return false;
			}
			return await response.json();
		} catch ( error ) {
			return false;
		}
	};

	const handleSubmit = async ( e ) => {
		e.preventDefault();
		if ( isCreating ) {
			return;
		}
		setIsCreating( true );

		const siteData = {
			company_name: companyName,
			space_name: spaceName,
			action: 'create_space',
		};

		const data = new URLSearchParams( siteData );

		const response = await fetch( App.ajax_url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: data.toString(),
		} );

		if ( ! response.ok ) {
			toast.error( __( 'Error creating site.' ), {
				autoClose: 3000,
			} );
			setIsCreating( false );
		}

		const {
			success,
			// eslint-disable-next-line camelcase
			data: { message, queue_id },
		} = await response.json();

		if ( success ) {
			toast.success(
				message ||
					__( 'Site queued for creation… Please wait…', 'app' ),
				{
					autoClose: 3000,
				}
			);

			const toastId = toast.loading( message );

			const intervalId = setInterval( async () => {
				setLoadingMessage(
					messages[ Math.floor( Math.random() * 8 ) ]
				);
				toast.update( toastId, {
					render: loadingMessage,
					type: 'info',
					isLoading: true,
				} );
				const {
					// eslint-disable-next-line camelcase
					data: { done, initial_page },
				} = await checkInstallFinished( queue_id );

				if ( done ) {
					clearInterval( intervalId );
					toast.update( toastId, {
						render: __(
							"Provision completed, let's set your first run"
						),
						type: 'success',
						isLoading: false,
					} );
					setTimeout( () => {
						// eslint-disable-next-line camelcase
						location.href = initial_page;
					}, 3000 );
				}
			}, 3 * 1000 );
		} else {
			setIsCreating( false );
			toast.error( message || __( 'Error creating site.', 'app' ), {
				autoClose: 3000,
			} );
		}
	};

	return (
		<form
			id="create-space"
			onSubmit={ handleSubmit }
			method="post"
			noValidate
		>
			<div className="message animate-display is-hidden"></div>
			<div className="form-group">
				<label htmlFor="company_name" className="mb-1">
					{ __(
						'Business Name (Legal name for individuals or company)',
						'app'
					) }
					<span className="text-danger">*</span>
				</label>
				{ /* eslint-disable jsx-a11y/tabindex-no-positive */ }
				<input
					type="text"
					tabIndex="1"
					className="input-lg"
					value={ companyName }
					onChange={ handleCompanyName }
					onKeyUp={ maskSpaceNameInput }
					name="company_name"
					disabled={ isCreating }
					id="company_name"
				/>
			</div>
			<div className="form-group">
				<label htmlFor="space_name" className="mb-1">
					{ __( 'Site name', 'app' ) }{ ' ' }
					<span className="text-danger">*</span>
				</label>
				<input
					type="text"
					tabIndex="2"
					maxLength="16"
					className="input-lg"
					value={ spaceName }
					onChange={ handleSpaceName }
					onKeyUp={ maskSpaceNameInput }
					name="space_name"
					disabled={ isCreating }
					id="space_name"
					placeholder={ __( 'an-awesome-handle' ) }
				/>
				<div className="mt-2 text-charcoal-light">
					<div className="my-2">
						https://<strong>{ spaceName ?? 'mysite' }</strong>
						.mody.cloud
					</div>
					<em>
						{ __(
							"This will be the URL where you'll use to access your Space"
						) }
					</em>
				</div>
			</div>
			<div className="form-group">
				<button
					type="submit"
					className="btn btn-wide d-flex"
					tabIndex="3"
					disabled={ isCreating }
				>
					{ isCreating && (
						<div className="loading-icon-white-1 mr-2"></div>
					) }
					{ isCreating && loadingMessage }
					{ ! isCreating && __( 'Create my Space', 'app' ) }
				</button>
			</div>
		</form>
	);
};
export default CreateSiteForm;
