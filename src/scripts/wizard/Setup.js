import {__} from '@wordpress/i18n';
import Utils from "../tools/Utils";
import Submit from "../tools/Submit";

export default {
    form: document.getElementById('create-space'),
    company_name: document.getElementById('company_name'),
    space_name: document.getElementById('space_name'),
    submitButtonText: 'Create my Space',
    submitButtonLoadingText: 'Creating your Space...',
    submitButtonSuccessText: 'Space created. Redirecting...',
    timer: null,
    init() {
        if (!this.form) return;
        this.submitButton = this.form.querySelector('button[type=submit]');
        this.message = this.form.querySelector('.message');
        this.form.addEventListener('submit', Submit.bind(this));
        this.space_name.addEventListener('blur', this.check_site_name_exists.bind(this));
        this.company_name.addEventListener('blur', this.check_site_name_exists.bind(this));
    },
    validateForm(data) {
        const errors = [];
        const company_name = data.get('company_name');
        const space_name = data.get('space_name');

        if (!company_name || company_name.trim().length === 0) {
            errors.push(__('Your company name is required.'));
        }

        if (!space_name) {
            errors.push(__('The space name is required'))
        }

        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(space_name)) {
            errors.push(__('The space name should be URL friendly. <em>No spaces, no special characters</em>.'));
        }

        return errors;
    },
    async check_site_name_exists(event) {
        const data = new URLSearchParams();
        const space_name = document.getElementById('space_name').value;
        if (!space_name) {
            Utils.displayMessage(this.message, __('The space name is required.'), 'error');
            return;
        }
        data.append('action', 'check_space_name_exists');
        data.append('space_name', this.space_name.value);

        Utils.hideMessage(this.message);
        Utils.toggleButton(
            this.submitButton,
            true,
            'Checking if your URL is available...',
            'white'
        );

        const response = await fetch(App.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
            throw new Error('Network response was not ok.');
        }

        const datum = await response.json();
        if (datum?.data?.exists) {
            Utils.displayMessage(this.message, datum?.data?.message, 'error');
            Utils.toggleButton(this.submitButton, true, 'Fix the site name to create your Space.');
        } else {
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
        }
    },
    async process_submit(formData) {
        const data = new URLSearchParams();
        formData.forEach((value, key) => {
            data.append(key, value);
        });
        const install_key = localStorage.getItem('install_key');
        if(install_key) {
            data.append('install_key', install_key);
        }
        data.append('action', 'create_space');

        const response = await fetch(App.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString(),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        return response.json();
    },
    poll_check_finished_install(callback_data) {
        Utils.toggleButton(this.submitButton, true, this.submitButtonLoadingText, 'white');
        Utils.disableFields(this.form);
        const {queue_id} = callback_data;
        const intervalId = setInterval(async () => {
            const {
                success,
                data: {message, done, ping_page}
            } = await this.check_finished_install(queue_id);

            if (done) {
                clearInterval(intervalId);
                Utils.toggleButton(
                    this.submitButton,
                    true,
                    message,
                    'white'
                );

                if (ping_page) {
                    location.href=ping_page;
                }
            }
            Utils.toggleButton(this.submitButton, true, this.submitButtonLoadingText, 'white');
        }, 3 * 1000);
    },
    async check_finished_install(queue_ui) {
        const data = new URLSearchParams({
            'action': 'check_setup_finished',
            'queue_id': queue_ui
        });
        try {
            const response = await fetch(App.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data.toString(),
            });
            if (!response.ok) {
                return false;
            }
            return await response.json();
        } catch (error) {
            return false;
        }
    }
}
