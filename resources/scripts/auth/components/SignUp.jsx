import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import {useAuth} from "../AuthContext";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import AuthLinks from "./AuthLinks";
import handleRecaptchaVerify from "../../tools/validateRecaptcha";

const SignUp = () => {
    const {email, setEmail, loading, error} = useAuth();
    const [signingUp, setSigningUp] = useState(false);
    const [signedUp, setSignedUp] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [uuid, setUuid] = useState('');
    const [recaptchaSiteKey] = useState(App.recaptcha_key);

    const emailRef = React.useRef(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const emailParam = queryParams.get('email');

    useEffect(() => {
        if(!email) {
            emailRef.current.focus();
        }

        localStorage.setItem('uuid', uuid);
        document.cookie = `uuid=${uuid}; path=/; domain=.modycloud.test; Secure`;
    }, [uuid]);

    useEffect(() => {
        if(emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    const handleEmailChange = (e) => setEmail(e.target.value);

    const authLinks = <AuthLinks
        leftLink='/auth/forgot-passwd'
        leftText={__('Forgot password', 'app')}
        rightLink='/auth/sign-in'
        rightText={__('Sign in', 'app')}
    />;

    const sendToRecaptcha = (event) => {
        event.preventDefault();
        handleRecaptchaVerify(event, handleSubmit, recaptchaSiteKey)
    };

    const handleSubmit = async (token) => {
        setSigningUp(true);

        const userData = {
            email,
            action: 'sign_up',
            token: token
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
                __('Error signing up.', 'app'),
                {
                    autoClose: 3000,
                }
            )
            console.error(
                sprintf(
                    __('Error signing up. Code: %s', 'app'),
                    response.statusText
                )
            );
            setSigningUp(false);
        }

        const {success, data: {message, uuid}} = await response.json();

        if (success) {
            setSignedUp(true);
            setSuccessMessage(message)
            setUuid(uuid)
            toast.success(
                successMessage || __('Sign up successful.', 'app'),
                {
                    autoClose: 3000,
                }
            )
        } else {
            setSigningUp(false);
            toast.error(
                message || __('Error signing up.', 'app'),
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
            {!signedUp ?
                (
                    <form className={'sign-up'} onSubmit={sendToRecaptcha}>
                        <div className="form-group">
                            <label htmlFor="email">{__('Email', 'app')}</label>
                            <input
                                type="email"
                                className="input-lg"
                                value={email}
                                id="email"
                                disabled={signingUp}
                                ref={emailRef}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {authLinks}
                        <div className="form-group col-12">
                            <button type="submit" className="btn btn-primary text-white btn-wide d-flex"
                                    disabled={signingUp || !email}>
                                {signingUp && <div className="loading-icon-white-1 mr-2"></div>}
                                {signingUp && __('Signing up', 'app')}
                                {!signingUp && __('Sign up')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {authLinks}
                        <div className="message my-2 p-2 rounded radius-sm is-visible">
                            {successMessage}
                        </div>
                    </>
                )
            }
        </>
    );
};

export default SignUp;
