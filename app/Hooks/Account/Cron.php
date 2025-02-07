<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;
use function Env\env;

class Cron {
    public static function sync_password(): void {
        $users_pass_sync_path = Config::get('MC_USERS_PATH');
        if (!is_dir($users_pass_sync_path)) {
            return;
        }

        $is_child_site = env('CHILD_SITE');
        if($is_child_site) {
            return;
        }

        $site_name = get_bloginfo();
        app_log("Syncing passwords in {$site_name}.");

        $sync_files = glob("{$users_pass_sync_path}/*.sync");
        foreach ($sync_files as $sync_file) {
            $user_email = base64_decode(basename($sync_file, '.sync'));
            $user = get_user_by('email',$user_email);
            if(!$user) { continue; }
            $user_id = $user->ID;
            $current_password_hash = $user->user_pass;
            $new_password_hash = file_get_contents($sync_file);

            if ($current_password_hash === $new_password_hash) { continue; }

            app_log("Syncing password for {$user->user_email} in {$site_name}.");

            global $wpdb;
            if($wpdb->update(
                $wpdb->users,
                array('user_pass' => $new_password_hash),
                array('ID' => $user_id)
            )) {
                app_log("Password synced for {$user->user_email} in {$site_name}.");
                update_user_meta($user_id, 'password_sync_status', 'synced');
            }
        }
    }
}