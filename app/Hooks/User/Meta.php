<?php

namespace App\Hooks\User;

use Ramsey\Uuid\Uuid;
use Roots\WPConfig\Config;

class Meta {
    public static function insert_custom_user_meta(
        array $custom_meta,
        \WP_User $user,
        bool $update,
        array $userdata
    ): array {
        if ($update) {
            return $custom_meta;
        }
        $uuid = get_user_meta($user->ID, 'uuid', true);
        if (!$uuid) {
            $uuid = Uuid::uuid4();
            update_user_meta($user->ID, 'uuid', $uuid);
            $custom_meta['uuid'] = $uuid;

            $user_dir = Config::get('MC_USERS_PATH');
            if(!$user_dir) {
                return $custom_meta;
            }

            if(!is_dir($user_dir)) {
                mkdir($user_dir, 0755, true);
            }

            $file_name = "{$user_dir}/{$uuid}.json";
            if(!file_put_contents($file_name, json_encode([
                'wp_user' => $user,
                'uuid' => $uuid,
                'application_password' => null,
            ]))){
                return $custom_meta;
            }
        }
        return $custom_meta;
    }
}