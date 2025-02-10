<?php

namespace App\Hooks\Account;

use Roots\WPConfig\Config;
use function Env\env;

class Cron {
    public static function sync_password(): void {
        $users_pass_sync_path = Config::get('MC_UUID_PATH');
        if (!is_dir($users_pass_sync_path)) {
            return;
        }

        $is_child_site = Config::get('CHILD_SITE');
        if ($is_child_site) {
            return;
        }

        $site_name = get_bloginfo();
        app_log("Syncing passwords in {$site_name}.");

        $ext = '.user.uuid.json';
        $sync_files = glob("{$users_pass_sync_path}/*{$ext}");
        $processed = [];

        foreach ($sync_files as $sync_file) {
            $user_data = json_decode(file_get_contents($sync_file));
            $basename = basename($sync_file, $ext);
            [$uuid, $user_id] = explode('.', $basename);
            $last_modification_date = 0;
            $last_modification_hash = 0;


            if(array_key_exists($uuid, $processed)) {
                $last_modification_date = array_key_exists('last_modification_date', $processed[$uuid]) ?
                    $processed[$uuid]['last_modification_date'] : null;
                $last_modification_hash = array_key_exists('last_modification_hash', $processed[$uuid]) ?
                    $processed[$uuid]['last_modification_hash'] : null;
            }

            $new_modification_date = max($user_data->last_modification_date, $last_modification_date);
            $new_modification_hash = $last_modification_date > $user_data->last_modification_date ?
                $last_modification_hash : $user_data->last_modification_hash;

            if($new_modification_date > $last_modification_date) {
                $file_name_to_update = app_get_user_uuid_file_name($uuid, $user_id);
                $user_to_update = json_decode(file_get_contents($file_name_to_update));
                $user_to_update->wp_user->user_pass = $user_data->wp_user->user_pass;
                $user_to_update->last_modification_hash = $new_modification_date;
                $user_to_update->last_modification_date = $new_modification_hash;

                $processed[$uuid] = array(
                    'user_id' => $user_id,
                    'last_modification_date' => $new_modification_date,
                    'last_modification_hash' => $new_modification_hash,
                );
            }
        }
        app_log(print_r($processed, 1));
    }
}