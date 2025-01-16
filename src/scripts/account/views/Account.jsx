import {useState} from 'react';
import {__} from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {useUser} from "@modycloud/account/context/AccountContext";
import {toast} from "react-toastify";

const Account = () => {
    const {user, setUser, loading, error} = useUser();
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [updating, setUpdating] = useState(false);

    if (!(email && userId) && null !== user) {
        setUserId(user?.id);
        setEmail(user?.email);
        setName(user?.name);
        setLastName(user?.last_name);
        setPhone(user?.phone);
    }

    const capitalize = (word) => {
        return word
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleNameChange = (e) => setName(capitalize(e.target.value));
    const handleLastNameChange = (e) => setLastName(capitalize(e.target.value));
    const handlePhoneChange = (e) => setPhone(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdating(true);

        const userData = {
            user_id: userId || user?.id,
            email,
            name,
            last_name: lastName,
            phone
        };

        apiFetch({
            path: '/app/v1/update-account/',
            method: 'POST',
            data: userData
        })
            .then(response => {
                setUser(prevUser => ({...prevUser, ...userData}));
                setUpdating(false)

                if(response.success) {
                    toast.success(
                        response.message || __('User data updated successfully.'),
                        {
                            autoClose: 3000,
                        }
                    )
                    document.querySelector('.header .user .dropdown .name a')
                        .innerText = capitalize(`${name} ${lastName}`);
                } else {
                    toast.error(
                        response.message || __('Error updating user data.'),
                        {
                            autoClose: 3000,
                        }
                    )
                }
            })
            .catch(error => {
                console.error('Error updating user data:', error);
                toast.error(
                    __('Error updating user data.'),
                    {
                        autoClose: 3000,
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
            {user && !loading ? (
                <form className={'container'} onSubmit={handleSubmit}>
                    <div className="form-group col-6">
                        <img src={user?.avatar_urls[96]} alt={`${name} ${lastName}`} className='rounded radius-circle'/>
                    </div>
                    <div className="form-group col-6 justify-end items-start p-relative">
                        {updating && <div className="loading-icon-primary-2 p-absolute top right"></div>}
                    </div>
                    <div className="form-group col-12">
                        <label htmlFor="email">{__('Email')}</label>
                        <input
                            type="email"
                            className="input-lg"
                            value={email}
                            id="email"
                            disabled={updating}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="form-group col-6">
                        <label htmlFor="name">{__('Name')}</label>
                        <input
                            type="text"
                            className="input-lg"
                            value={name}
                            id="name"
                            disabled={updating}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="form-group col-6">
                        <label htmlFor="last_name">{__('Last name')}</label>
                        <input
                            type="text"
                            className="input-lg"
                            value={lastName}
                            id="last_name"
                            disabled={updating}
                            onChange={handleLastNameChange}
                        />
                    </div>
                    <div className="form-group col-6">
                        <label htmlFor="phone">{__('Phone number')}</label>
                        <input
                            type="text"
                            className="input-lg"
                            value={phone}
                            id="phone"
                            disabled={updating}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <div className="form-group col-12">
                        <button type="submit" className="btn btn-primary text-white" disabled={updating}>
                            {__('Save info')}
                        </button>
                    </div>
                </form>
            ) : (
                <p>{__('User not found')}</p>
            )}
        </>
    );
};

export default Account;
