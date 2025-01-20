import {useState} from 'react';
import {__, sprintf} from '@wordpress/i18n';
import {navigate, useAuth} from "@modycloud/auth/AuthContext";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import {useEffect} from "@wordpress/element";
import AuthLinks from "@modycloud/auth/components/AuthLinks";

const ForgotPassword = () => {
    const {email, setEmail, loading, error} = useAuth();
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const emailParam = queryParams.get('email');

    const emailRef = React.useRef(null);

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }

        if(!email) {
            emailRef.current.focus();
        }
    }, [emailParam]);

    const handleEmailChange = (e) => setEmail(e.target.value);

    const authLinks = <AuthLinks
        leftLink='/auth/sign-in'
        leftText={__('Sign In', 'app')}
        rightLink='/auth/sign-up'
        rightText={__('Sign up', 'app')}
    />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSendingEmail(true);

        const userData = {
            email,
            action: 'forgot_password'
        };

        const data = new URLSearchParams(userData);

        const response = await fetch(App.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            toast.error(
                __('Error sending email.', 'app'),
                {
                    autoClose: 3000,
                }
            )
            console.error(sprintf(__('Error sending email. Code: %s', 'app'), response.statusText))
            setSendingEmail(false);
        }

        const {success, data: {initial_page, message}} = await response.json();

        if (success) {
            setEmailSent(true);
            setSuccessMessage(message)
            toast.success(
                successMessage || sprintf(__('We sent an email to %s.', 'app'), email),
                {
                    autoClose: 3000,
                }
            )
        } else {
            setSendingEmail(false);
            toast.error(
                message || __('Error sending email.', 'app'),
                {
                    autoClose: 3000,
                }
            )
        }
    };


    if (loading) {
        return <div className={'loading-icon-primary-2'}></div>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <>
            {!emailSent ?
                (
                    <form className={'forgot-password'} onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">{__('Email', 'app')}</label>
                            <input
                                type="email"
                                className="input-lg"
                                value={email}
                                id="email"
                                disabled={sendingEmail}
                                ref={emailRef}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {authLinks}
                        <div className="form-group col-12">
                            <button type="submit" className="btn btn-primary text-white btn-wide d-flex"
                                    disabled={sendingEmail || !email}>
                                {sendingEmail && <div className="loading-icon-white-1 mr-2"></div>}
                                {sendingEmail && __('Sending email...', 'app')}
                                {!sendingEmail && __('Reset my password', 'app')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="message my-2 p-2 rounded radius-sm is-visible">
                            {successMessage}
                        </div>
                        {authLinks}
                    </>
                )
            }
        </>
    );
};

export default ForgotPassword;
