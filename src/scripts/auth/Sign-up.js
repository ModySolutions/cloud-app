import validator from 'validator';
import {__} from '@wordpress/i18n';

export default {
    form: document.getElementById('sign-up'),
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.form.addEventListener('submit', this.submit.bind(this));
    },
    async submit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const errors = this.validateForm(formData);

        const authMessage = this.form.querySelector('.auth-message');

        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = __('Signing up...');
        }

        if (errors.length > 0) {
            this.displayMessage(authMessage, errors[0], 'error');
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = __('Sign up');
            }
            return;
        }

        try {
            const { success, data } = await this.sign_up(formData);
            if (!success) {
                this.displayMessage(authMessage, data.message, 'error');
                if (this.submitButton) {
                    this.submitButton.disabled = false;
                    this.submitButton.innerHTML = __('Sign up');
                }
            } else {
                this.displayMessage(authMessage, data.message, 'success');
                this.form.querySelectorAll('div:not(.auth-message)').forEach(div => div.remove());
                if (this.submitButton) {
                    this.submitButton.innerHTML = __('Check your email...');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.innerHTML = __('Sign up');
            }
        }
    },
    validateForm(data) {
        const errors = [];
        const email = data.get('email');
        if (!email || !validator.isEmail(email)) {
            errors.push(__('Invalid email address'));
        }
        return errors;
    },
    displayMessage(container, message, type = 'error') {
        if (!container) return;

        container.textContent = message;
        container.className = 'my-3 ' + `auth-message ${type === 'error' ?
            'bg-danger-light text-danger-dark' : 'bg-success-light text-success-dark'}`;
        container.style.display = 'block';
    },
    async sign_up(formData) {
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });
        data.append('action', 'sign_up');

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
