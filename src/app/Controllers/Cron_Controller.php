<?php

namespace App\Controllers;

use App\Controllers\Queue\Cron as Queue;
use App\Controllers\Sites\Cron as Install;

class Cron_Controller {
    public static function init() : void {
        add_action('app_process_queue', Queue::process(...));
        add_action('app_finish_install', Install::process(...));
        add_filter('cron_schedules', self::cron_schedules(...));

        self::_schedule();
    }

    public static function cron_schedules(array $schedules) : array {
        $schedules['every_minute'] = array(
            'interval' => 60,
            'display' => __('Every minute'),
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
    }
}