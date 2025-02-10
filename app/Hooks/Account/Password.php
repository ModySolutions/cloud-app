<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;

class Password {
    public static function wp_set_password(string $password, int $user_id) : void {
        if(Config::get('CHILD_SITE')) {
            self::propagate_passwd_from_child($password, $user_id);
        } else {
            self::propagate_passwd_from_main($password, $user_id);
        }
    }

    public static function propagate_passwd_from_child(string $password, int $user_id) : void {
        $user_uuid = app_get_user_uuid($user_id);
        $uuid_file_name = app_get_user_uuid_file_name($user_uuid, $user_id);

        $file_data = app_update_sync_data($user_id, $user_uuid, $uuid_file_name);
        file_put_contents($uuid_file_name, json_encode($file_data));
    }

    public static function propagate_passwd_from_main(string $password, int $user_id) : void {

    }
}