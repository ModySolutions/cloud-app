import Alpine from "alpinejs";
import toKebabCase from "./kebabcase";
import {__} from "@wordpress/i18n";

export default {
    init() {
        Alpine.magic('kebabcase', () => {
            return subject => toKebabCase(subject)
        })
    },
    toggleButton(button, disabled, text, loading = undefined, size = 1) {
        if (button) {
            button.disabled = disabled;
            if(loading) {
                const loader = this.loading(loading, size);
                button.innerHTML = '';
                button.appendChild(loader);
                const textContainer = document.createElement('span');
                textContainer.className = 'ml-1';
                textContainer.innerHTML = __(text);
                button.appendChild(textContainer);
            } else {
                button.innerHTML = __(text);
            }
        }
    },
    loading(color, size){
        const validColors = ['primary', 'black', 'white'];
        const validSizes = [1, 2, 3, 4, 5];

        if (!validColors.includes(color)) {
            throw new Error(`Invalid color: ${color}. Valid options are ${validColors.join(', ')}.`);
        }

        if (!validSizes.includes(size)) {
            throw new Error(`Invalid size: ${size}. Valid options are ${validSizes.join(', ')}.`);
        }

        const loadingIcon = document.createElement('span');
        loadingIcon.className = `loading-icon-${color}-${size}`;
        return loadingIcon;
    },
    displayMessage(container, message, type = 'error', spacing = 2) {
        if (!container) return;

        container.innerHTML = message;

        let containerClassNames = [
            `my-${spacing}`,
            `p-${spacing}`,
            'rounded',
            'radius-sm',
            'message',
            'animate-display',
            'is-visible'
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
    },
    hideMessage(container) {
        if (!container) return;

        container.innerHTML = '';
        container.className = 'animate-display is-hidden';
    },
    disableFields(element, selector = 'input') {
        element.querySelectorAll(selector).forEach((element) => {
            element.disabled = true;
        });
    },
    enableFields(element, selector = 'input') {
        element.querySelectorAll(selector).forEach((element) => {
            element.disabled = false;
        });
    }
}