<?php

use Roots\WPConfig\Config;

if (!function_exists('app_log')) {
    function app_log($message): void
    {
        $log_file = Config::get('LOGS_PATH') . '/app.log';

        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 1);
        $caller = $backtrace[0] ?? null;
        $file = $caller['file'] ?? 'Unknown file';

        $timestamp = date('Y-m-d H:i:s');

        $user = __('Guest');
        if (function_exists('wp_get_current_user')) {
            $current_user = wp_get_current_user();
            if ($current_user->exists()) {
                $user = $current_user->user_login;
            }
        } elseif (is_cli()) {
            $user = __('Command Line Interface');
        }

        $log_entry = sprintf("[%s] [%s] [%s] %s\n", $timestamp, $file, $user, $message);

        file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    }

}
