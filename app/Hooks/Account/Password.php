<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;

class Password {
    public static function wp_set_password(string $password, int $user_id) : void {
        if(!is_dir(Config::get('MC_USERS_PATH'))) {
            mkdir(Config::get('MC_USERS_PATH'), 0755, true);
        }

        $user = get_user($user_id);
        $password_hash = $user->user_pass;

        $file_name = base64_encode($user->user_email);
        $file_path = Config::get('MC_USERS_PATH') . "/{$file_name}.sync";
        if(!is_file($file_path)) {
            touch($file_path);
        }

        file_put_contents($file_path, $password_hash);
    }
}