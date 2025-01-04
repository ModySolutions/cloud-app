import { __ } from '@wordpress/i18n';
import Submit from "../tools/Submit";

export default {
    form: document.getElementById('reset-password'),
    submitButtonText: 'Reset password',
    submitButtonLoadingText: 'Resetting password...',
    submitButtonSuccessText: 'Password reset successfully!',
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.message = this.form.querySelector('.message');
        this.form.addEventListener('submit', Submit.bind(this));
    },
    validateForm(data) {
        const errors = [];

        const password = data.get('password');
        const confirmPassword = data.get('confirm-password');

        if (!password || !this.isSecurePassword(password)) {
            errors.push(__('Password must be at least 8 characters long, contain one uppercase letter, and one special character.'));
        }

        if (password !== confirmPassword) {
            errors.push(__('Passwords do not match.'));
        }

        const key = data.get('key');
        const email = data.get('email');
        if (!key || !email) {
            errors.push(__('Invalid reset link.'));
        }

        return errors;
    },
    isSecurePassword(password) {
        const pattern = /^(?=.*[A-Z])(?=.*[\W])(?=.*[a-zA-Z0-9]).{8,}$/;
        return pattern.test(password);
    },
    async process_submit(formData) {
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });
        data.append('action', 'reset_password');

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
};
