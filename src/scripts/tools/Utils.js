import Alpine from "alpinejs";
import toKebabCase from "./kebabcase";
import {__} from "@wordpress/i18n";

export default {
    init() {
        Alpine.magic('kebabcase', () => {
            return subject => toKebabCase(subject)
        })
    },
    toggleButton(button, disabled, text) {
        if (button) {
            button.disabled = disabled;
            button.innerHTML = __(text);
        }
    },
    displayMessage(container, message, type = 'error', spacing = 2) {
        if (!container) return;

        container.innerHTML = message;

        let containerClassNames = [
            `my-${spacing}`,
            `p-${spacing}`,
            'rounded',
            'radius-sm',
            'message'
        ];

        switch(type) {
            case 'error':
                containerClassNames.push('bg-danger-light');
                containerClassNames.push('text-danger-dark');
                break;
            case 'success':
                containerClassNames.push('bg-success-light');
                containerClassNames.push('text-success-dark');
                break;
            case 'info':
                containerClassNames.push('bg-info-light');
                containerClassNames.push('text-info-dark');
                break;
            case 'warning':
                containerClassNames.push('bg-warning-light');
                containerClassNames.push('text-warning-dark');
                break;
        }
        container.className = containerClassNames.join(' ');
        container.style.display = 'block';
    }
}