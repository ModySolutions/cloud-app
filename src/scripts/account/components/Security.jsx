import {useState} from 'react';
import {__} from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {useUser} from "../AccountContext";
import {toast} from "react-toastify";
import {useLocation} from "react-router-dom";

const Security = () => {
    const {user, setUser, loading, error} = useUser();
    const [userId, setUserId] = useState();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [updating, setUpdating] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
    const [code, setCode] = useState('');

    if (!userId && null !== user) {
        setUserId(user?.id);
    }

    const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
    const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
    const handleConfirmNewPassword = (e) => setConfirmNewPassword(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdating(true);

        const userData = {
            user_id: userId,
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword
        };

        apiFetch({
            path: '/app/v1/update-user-password/',
            method: 'POST',
            data: userData
        })
            .then(response => {
                setUpdating(false);
                const {success, message} = response;
                if (success) {
                    toast.success(
                        message || __('Password changed successfully.'),
                        {
                            autoClose: 3000,
                        }
                    )
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)
                } else {
                    toast.error(
                        message || __('Error updating user password.'),
                        {
                            autoClose: 3000,
                        }
                    )
                }
            })
            .catch(error => {
                console.error('Error updating user password:', error);
                toast.error(
                    __('Error updating user password.'),
                    {
                        autoClose: 10000,
                    }
                )
                setUpdating(false);
            });
    };

    if (loading) {
        return <div className={'loading-icon-primary-2'}></div>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <>
            {user ? (
                <form className={'container'} onSubmit={handleSubmit}>
                    <div className="col-6">
                        <h3>{__('Change your password')}</h3>
                    </div>
                    <div className="col-6 justify-end items-start p-relative">
                        {updating && <div className="loading-icon-primary-2 p-absolute top right"></div>}
                    </div>
                    <div className="form-group col-12">
                        <label htmlFor="current-password">{__('Current password')}</label>
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            className="input-lg"
                            value={currentPassword}
                            id="current-password"
                            disabled={updating}
                            onChange={handleCurrentPasswordChange}
                        />
                        <span className="toggle-password" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {!showCurrentPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                </svg>
                            }
                            {showCurrentPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/>
                                </svg>
                            }
                        </span>
                    </div>
                    <hr className='my-3 col-12'/>
                    <div className="form-group col-12">
                        <label htmlFor="new-password">{__('New password')}</label>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="input-lg"
                            value={newPassword}
                            id="new-password"
                            disabled={updating}
                            onChange={handleNewPasswordChange}
                        />
                        <span className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {!showNewPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                </svg>
                            }
                            {showNewPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/>
                                </svg>
                            }
                        </span>
                    </div>
                    <div className="form-group col-12">
                        <label htmlFor="confirm-new-password">{__('Confirm new password')}</label>
                        <input
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            className="input-lg"
                            value={confirmNewPassword}
                            id="confirm-new-password"
                            disabled={updating}
                            onChange={handleConfirmNewPassword}
                        />
                        <span className="toggle-password"
                              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {!showConfirmNewPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/>
                                </svg>
                            }
                            {showConfirmNewPassword &&
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960"
                                     width="30px">
                                    <path
                                        d="M480-312q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Zm0-72q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm0 192q-142.6 0-259.8-78.5Q103-349 48-480q55-131 172.2-209.5Q337.4-768 480-768q142.6 0 259.8 78.5Q857-611 912-480q-55 131-172.2 209.5Q622.6-192 480-192Zm0-288Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z"/>
                                </svg>
                            }
                        </span>
                    </div>

                    <div className="form-group col-12">
                        <button type="submit" className="btn btn-primary text-white" disabled={updating}>
                            {__('Change my password')}
                        </button>
                    </div>
                </form>
            ) : (
                <p>{__('User not found')}</p>
            )}
        </>
    );
};

export default Security;
