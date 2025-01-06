import validator from 'validator';
import {__} from '@wordpress/i18n';
import Submit from "../tools/Submit";

export default {
    form: document.getElementById('sign-up'),
    submitButtonText: 'Sign up',
    submitButtonLoadingText: 'Signing up...',
    submitButtonSuccessText: 'Check your email...',
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.message = this.form.querySelector('.message');
        this.form.addEventListener('submit', Submit.bind(this));
    },
    validateForm(data) {
        const errors = [];
        const email = data.get('email');
        if (!email || !validator.isEmail(email)) {
            errors.push(__('Invalid email address'));
        }
        return errors;
    },
    async process_submit(formData) {
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
    },
    hide_form() {
        this.form.querySelectorAll('div:not(.message)').forEach(div => div.remove());
    }
}
