import {__} from '@wordpress/i18n';
import Utils from "../tools/Utils";
import Submit from "../tools/Submit";

export default {
    form: document.getElementById('create-space'),
    space_name: document.getElementById('space_name'),
    submitButtonText: 'Create my Space',
    submitButtonLoadingText: 'Creating your Space...',
    submitButtonSuccessText: 'Space created. Redirecting...',
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.message = this.form.querySelector('.message');
        this.form.addEventListener('submit', Submit.bind(this));
        this.space_name.addEventListener('blur', this.check_site_name_exists.bind(this));
    },
    validateForm(data) {
        const errors = [];
        const blog_title = data.get('blog_title');
        const space_name = data.get('space_name');

        if (!blog_title || blog_title.trim().length === 0) {
            errors.push(__('Your company name is required.'));
        }

        if(!space_name) {
            errors.push(__('The site name is required'))
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(space_name)) {
            errors.push(__('The site name should be URL friendly. No spaces, no weird characters.'));
        }

        return errors;
    },
    async check_site_name_exists(event) {
        const data = new URLSearchParams();
        data.append('action', 'check_space_name_exists');
        data.append('space_name', this.space_name.value);

        Utils.toggleButton(this.submitButton, true, 'Checking if your URL is available...');

        const response = await fetch(App.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
            throw new Error('Network response was not ok');
        }

        const datum = await response.json();
        if(datum?.data?.exists) {
            Utils.displayMessage(this.message, datum?.data?.message, 'error');
            Utils.toggleButton(this.submitButton, true, 'Fix the URL to create your Space');
        } else {
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
        }
    },
    async process_submit(formData) {
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });
        data.append('action', 'create_site');

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
