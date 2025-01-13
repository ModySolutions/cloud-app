<?php

namespace App\Hooks;

use App\Hooks\Queue\Cron as Queue;
use App\Hooks\Migrations\Cron as Migration;
use App\Hooks\Account\Cron as Account;
use App\Hooks\Auth\Cron as Auth;

class CronHooks {
    public static function init() : void {
        add_action('app_process_queue', Queue::process(...));
        add_action('app_migrations', Migration::migrate(...));
        add_filter('sync_password', Account::sync_password(...));
        add_filter('delete_expired_tokens', Auth::delete_expired_tokens(...));
        add_filter('cron_schedules', self::cron_schedules(...));

        self::_schedule();
    }

    public static function cron_schedules(array $schedules) : array {
        $schedules['every_minute'] = array(
            'interval' => 60,
            'display' => __('Every minute'),
        );
        $schedules['every_five_minutes'] = array(
            'interval' => 60 * 5,
            'display' => __('Every five minutes'),
        );
        return $schedules;
    }

    private static function _schedule() : void {
        if(!wp_next_scheduled('app_process_queue')) {
            wp_schedule_event(time(), 'every_minute', 'app_process_queue');
        }

        if(!wp_next_scheduled('app_finish_install')) {
            wp_schedule_event(time(), 'every_minute', 'app_finish_install');
        }

        if(!wp_next_scheduled('app_migrations')) {
            wp_schedule_event(time(), 'every_minute', 'app_migrations');
        }

        if(!wp_next_scheduled('sync_password')) {
            wp_schedule_event(time(), 'every_minute', 'sync_password');
        }
    }
}