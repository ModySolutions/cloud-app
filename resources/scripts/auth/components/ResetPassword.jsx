import {useState, useEffect} from 'react';
import {__} from '@wordpress/i18n';
import {useAuth} from "@modycloud/auth/AuthContext";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";
import AuthLinks from "./AuthLinks";
import handleRecaptchaVerify from "../../tools/validateRecaptcha";

const ResetPassword = () => {
    const {email, setEmail, loading, error} = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstTime, setFirstTime] = useState('no');
    const [resetPasswordKey, setResetPasswordKey] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaSiteKey] = useState(App.recaptcha_key);

    const location = useLocation();
    const passwordRef = React.useRef(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const emailParam = queryParams.get('email');
        const resetPasswordKeyParam = queryParams.get('key');
        const firstTimeParam = queryParams.get('first_time');

        if (emailParam) {
            setEmail(emailParam);
        }

        if (resetPasswordKeyParam) {
            setResetPasswordKey(resetPasswordKeyParam);
        }

        if (firstTimeParam?.toString() === 'true') {
            setFirstTime('yes');
        }

        passwordRef.current.focus();
    }, [location]);

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const authLinks = <AuthLinks
        leftLink='/auth/sign-in'
        leftText={__('Sign In', 'app')}
        rightLink='/auth/sign-up'
        rightText={__('Sign up', 'app')}
    />;

    const sendToRecaptcha = (event) => {
        event.preventDefault();
        handleRecaptchaVerify(event, handleSubmit, recaptchaSiteKey)
    };

    const handleSubmit = async (token) => {
        setResettingPassword(true);

        const userData = {
            password,
            confirm_password: confirmPassword,
            key: resetPasswordKey,
            email: email,
            first_time: firstTime,
            action: 'reset_password',
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
                __('Error resetting your password.'),
                {
                    autoClose: 3000,
                }
            )
            console.error(
                sprintf(
                    __('Error resetting your password. Code: %s', 'app'),
                    response.statusText
                )
            )
            setResettingPassword(false);
        }

        const {success, data: {initial_page, message, uuid}} = await response.json();

        if (success) {
            setSuccessMessage(message)
            toast.success(
                successMessage || __('Reset password successful.', 'app'),
                {
                    autoClose: 3000,
                }
            )

            if (initial_page === 'navigate-to-sign-in') {
                document.querySelector('[href="/auth/sign-in"]').click()
            } else {
                window.location.href = initial_page;
            }
        } else {
            setResettingPassword(false);
            toast.error(
                message || __('Error resetting your password.', 'app'),
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
            {!passwordReset ?
                (
                    <form className={'reset-password'} onSubmit={sendToRecaptcha}>
                        <div className='form-group'>
                            <label htmlFor='name'>{__('Password', 'app')}</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='input-lg'
                                value={password}
                                id='name'
                                disabled={resettingPassword}
                                ref={passwordRef}
                                onChange={handlePasswordChange}
                            />
                            <span className='toggle-password' onClick={() => setShowPassword(!showPassword)}>
                                {!showPassword ?
                                    (
                                        <svg xmlns='http://www.w3.org/2000/svg' height='30px' viewBox='0 -960 960 960'
                                             width='30px'>
                                            <path
                                                d='m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z'/>
                                        </svg>
                                    ) : (
                                        <svg xmlns='http://www.w3.org/2000/svg' height='30px' viewBox='0 -960 960 960'
                                             width='30px'>
                                            <path
                                                d='M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z'/>
                                        </svg>
                                    )
                                }
                            </span>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='name'>{__('Confirm password', 'app')}</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className='input-lg'
                                value={confirmPassword}
                                id='name'
                                disabled={resettingPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <span className='toggle-password'
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {!showConfirmPassword ?
                                    (
                                        <svg xmlns='http://www.w3.org/2000/svg' height='30px' viewBox='0 -960 960 960'
                                             width='30px'>
                                            <path
                                                d='m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z'/>
                                        </svg>
                                    ) : (
                                        <svg xmlns='http://www.w3.org/2000/svg' height='30px' viewBox='0 -960 960 960'
                                             width='30px'>
                                            <path
                                                d='M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z'/>
                                        </svg>
                                    )
                                }
                            </span>
                        </div>
                        {authLinks}
                        <div className='form-group col-12'>
                            <button type='submit' className='btn btn-primary text-white btn-wide d-flex'
                                    disabled={resettingPassword}>
                                {resettingPassword && <div className='loading-icon-white-1 mr-2'></div>}
                                {resettingPassword && __('Resetting your password', 'app')}
                                {!resettingPassword && __('Reset password', 'app')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {authLinks}
                        <div className='message my-2 p-2 rounded radius-sm is-visible'>
                            {successMessage}
                        </div>
                    </>
                )
            }
        </>
    );
};

export default ResetPassword;
