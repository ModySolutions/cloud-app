import { __ } from '@wordpress/i18n';

const CreateSiteIntro = () => {
    return (
        <div className="setup-wizard-intro my-3">
            <h2 className="text-center mb-3">{ __('Set up your Space in just a few steps!') }</h2>
            <p>{ __('Fill out the form with your company name and site URL. Once ready, we will:') }</p>
            <ol className="my-2">
                <li className="ml-3">{ __('Create your site within our platform.') }</li>
                <li className="ml-3">{ __('Set up the theme and essential tools for you.') }</li>
                <li className="ml-3">{ __('Redirect you to your personalized dashboard, so you can start right away.') }</li>
            </ol>
            <p>{ __('Click "Create my Space" to begin your digital journey.') }</p>
        </div>
    )
}

export default CreateSiteIntro;