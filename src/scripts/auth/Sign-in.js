import validator from 'validator';
import {__} from '@wordpress/i18n';

export default {
    form: document.getElementById('sign-in'),
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.form.addEventListener('submit', this.submit.bind(this))
    },
    async submit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const errors = this.validateForm(formData);

        const authMessage = this.form.querySelector('.auth-message');

        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = __('Signing in...');
        }

        if (errors.length > 0) {
            this.displayMessage(authMessage, errors[0], 'error');
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = __('Sign in');
            }
            return;
        }

        try {
            const { success, data } = await this.authenticate(formData);
            if(!success) {
                this.displayMessage(authMessage, data.message, 'error')
                if (this.submitButton) {
                    this.submitButton.disabled = false;
                    this.submitButton.innerHTML = __('Sign in');
                }
            } else {
                this.displayMessage(authMessage, data.message, 'success');
                if (this.submitButton) {
                    this.submitButton.innerHTML = __('Opening your panel...');
                }
                location.href=data?.initial_page || App.site_url;
            }
        } catch (error) {
            console.error('Error:', error);
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = __('Sign in');
            }
        }
    },
    validateForm(data) {
        const errors = [];
        const email = data.get('email');
        if (!email || !validator.isEmail(email)) {
            errors.push(__('Invalid email address'));
        }

        const password = data.get('password');
        if (!password) {
            errors.push(__('Please write your password'));
        }

        return errors;
    },
    displayMessage(container, message, type = 'error') {
        if (!container) return;

        container.innerHTML = message;
        container.className = 'my-3 ' + `auth-message ${type === 'error' ?
            'bg-danger-light text-danger-dark' : 'bg-success-light text-success-dark'}`;
        container.style.display = 'block';
    },
    async authenticate(formData) {
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });
        data.append('action', 'sign_in');

        const response = await fetch(App.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    }
}