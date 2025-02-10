<?php

namespace App\Hooks\User;

use Ramsey\Uuid\Uuid;
use Roots\WPConfig\Config;

class Service {
    public static function delete_user(int $user_id, int|null $reassign, \WP_User $user): void {
        if (!current_user_can('administrator')) {
            return;
        }

        $site_id = app_user_has_a_site($user_id);
        $site = get_post($site_id);

        if(!$site) {
            return;
        }
    }

    public static function insert_custom_user_meta(
        array $custom_meta,
        \WP_User $user,
        bool $update,
        array $userdata
    ): array {
        $user_id = $user->ID;
        $user_uuid = app_get_user_uuid($user_id);
        if(!$user_uuid) {
            do {
                $uuid = Uuid::uuid4();
                $user_uuid = $uuid->toString();
            } while(app_uuid_exists($user_uuid));
        }

        $custom_meta['uuid'] = $user_uuid;

        $uuid_file_name = app_get_user_uuid_file_name($user_uuid, $user_id);

        if(!is_dir(Config::get('MC_UUID_PATH'))) {
            mkdir(Config::get('MC_UUID_PATH'), 0755, true);
        }

        if($user_uuid && !is_file($uuid_file_name)){
            touch($uuid_file_name);
        }

        $file_data = app_update_sync_data($user_id, $user_uuid, $uuid_file_name);
        update_user_meta($user_id, 'uuid', $user_uuid);
        file_put_contents($uuid_file_name, json_encode($file_data));
        return $custom_meta;
    }
}