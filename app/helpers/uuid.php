<?php

if (!function_exists('app_get_user_uuid')) {
    function app_get_user_uuid(
        int|\WP_User|null $user = null
    ): string|null {
        $user_id = $user?->ID ?? $user ?? get_current_user_id();
        if (!$user_id) {
            return null;
        }

        return get_user_meta($user_id, 'uuid', true);
    }
}


if (!function_exists('app_get_post_uuid')) {
    function app_get_post_uuid(
        int|\WP_Post|null $post = null
    ): string|null {
        $post_id = $post?->ID ?? $post ?? get_the_ID();
        if (!$post_id) {
            return null;
        }

        return get_post_meta($post_id, 'uuid', true);
    }
}