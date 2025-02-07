<?php

namespace App\Hooks\Auth;

use Roots\WPConfig\Config;

class Cron {
    public static function delete_expired_tokens() : void{
        if (!is_dir(Config::get('MC_AUTOLOGIN_TOKENS_PATH'))) {
            return;
        }

        $tokens = glob(Config::get('MC_AUTOLOGIN_TOKENS_PATH') . '*.token');

        foreach($tokens as $token) {
            $last_modification_file = filemtime($token);
            $now = time();

            if (($now - $last_modification_file) > 300) {
                unlink($token);
            }
        }
    }
}