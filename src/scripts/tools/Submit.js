import Utils from "../tools/Utils";

export default async function(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const errors = this.validateForm(formData);

        Utils.toggleButton(this.submitButton, true, this.submitButtonLoadingText);

        if (errors.length > 0) {
            Utils.displayMessage(this.message, errors[0], 'error');
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
            return;
        }

        try {
            const { success, data: {initial_page, message} } = await this.process_submit(formData);
            if (!success) {
                Utils.displayMessage(this.message, message, 'error')
                Utils.toggleButton(this.submitButton, false, this.submitButtonText);
            } else {
                Utils.displayMessage(this.message, message, 'success')
                Utils.toggleButton(this.submitButton, false, this.submitButtonSuccessText);
                if(initial_page) {
                    location.href=initial_page;
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Utils.toggleButton(this.submitButton, false, this.submitButtonText);
        }
}
