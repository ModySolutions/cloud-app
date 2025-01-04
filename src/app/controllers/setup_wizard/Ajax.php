<?php

namespace App\controllers\setup_wizard;

class Ajax {
    public static function check_space_name_exists(): void {
        if (isset($_POST['space_name'])) {
            $space_name = sanitize_text_field($_POST['space_name']);
            $exists = self::_check_space_name_exists($space_name);
            wp_send_json_success(array(
                'exists' => $exists,
                'message' => sprintf(
                    __('Oh snap! The space name <strong>%s</strong> is already taken. Please try again with another one.'),
                    $space_name
                )
            ));
        } else {
            wp_send_json_error();
        }
    }

    private static function _check_space_name_exists(string $space_name): bool {
        $site = get_page_by_path($space_name, OBJECT, 'site');
        return !!$site;
    }
}