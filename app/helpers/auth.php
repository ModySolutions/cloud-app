<?php

use Roots\WPConfig\Config;

if (!function_exists('app_generate_autologin_token')) {
    function app_generate_autologin_token(WP_User $user): string {
        if (!is_dir(Config::get('MC_AUTOLOGIN_TOKENS_PATH'))) {
            mkdir(Config::get('MC_AUTOLOGIN_TOKENS_PATH'));
        }

        $hashed_email = base64_encode($user->user_email);
        $filename = Config::get('MC_AUTOLOGIN_TOKENS_PATH')."/{$hashed_email}.token";
        if (!file_exists($filename)) {
            touch($filename);
        }
        $token = wp_generate_password(64);
        file_put_contents($filename, $token);
        return $token;
    }
}

if (!function_exists('app_validate_autologin_token')) {
    function app_validate_autologin_token(WP_User $user, string $token): bool {
        if (!is_dir(Config::get('MC_AUTOLOGIN_TOKENS_PATH'))) {
            mkdir(Config::get('MC_AUTOLOGIN_TOKENS_PATH'), 0755, true);
        }

        $hashed_email = base64_encode($user->user_email);
        $filename = Config::get('MC_AUTOLOGIN_TOKENS_PATH')."/{$hashed_email}.token";

        if (!file_exists($filename)) {
            return false;
        }

        $last_modification_file = filemtime($filename);
        $now = time();

        if (($now - $last_modification_file) > 300) {
            unlink($filename);
            return false;
        }

        $stored_token = file_get_contents($filename);
        $valid = trim($token) === trim($stored_token);

        if ($valid) {
            unlink($filename);
        }

        return $valid;
    }
}

if(!function_exists('app_generate_logout_info')) {
    function app_generate_logout_info(WP_User $user) : void {
        if (!is_dir(Config::get('MC_LOGOUT_PATH'))) {
            mkdir(Config::get('MC_LOGOUT_PATH'), 0755, true);
        }

        $hashed_email = base64_encode($user->user_email);
        $filename = Config::get('MC_LOGOUT_PATH')."/{$hashed_email}";
        if(!file_exists($filename)) {
            touch($filename);
        }
    }
}

if(!function_exists('app_update_sync_data')){
    function app_update_sync_data(
        int $user_id,
        string $user_uuid,
        string $uuid_file_name
    ) : object {
        $last_modification_date = time();
        $last_modification_hash = wp_generate_password(64);
        $user = get_user($user_id);
        $user_uuid_files = app_get_user_uuid_files($user_uuid);

        $file_data = array();
        $ext = '.user.uuid.json';
        foreach($user_uuid_files as $uuid_file) {
            $user_data = json_decode(file_get_contents($uuid_file));
            $basename = basename($uuid_file, $ext);
            [$uuid, $user_id] = explode('.', $basename);
            $file_data = (object)array(
                'wp_user' => $user,
                'wp_user_meta' => get_user_meta($user_id),
                'uuid' => $user_uuid,
                'last_modification_hash' => $last_modification_hash,
                'last_modification_date' => $last_modification_date,
            );
            if(is_file($uuid_file)) {
                $file_data = json_decode(file_get_contents($uuid_file)) ?? new \stdClass();
                $file_data->wp_user->user_pass = $user->user_pass;
                $file_data->wp_user_meta = get_user_meta($user_id);
                $file_data->last_modification_hash = $last_modification_hash;
                $file_data->last_modification_date = $last_modification_date;
            }
        }

        update_user_meta($user_id, 'last_modification_date', $last_modification_date);
        update_user_meta($user_id, 'last_modification_hash', $last_modification_hash);
        return $file_data;
    }
}
