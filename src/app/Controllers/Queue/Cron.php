<?php

namespace App\Controllers\Queue;

class Cron {
    public static function process() : void {
        $queue_items = get_posts(array(
            'post_type' => 'queue',
            'post_status' => 'draft',
        ));

        if(count($queue_items) === 0) {
            return;
        }

        foreach ($queue_items as $queue_item) {
            wp_update_post(array(
                'ID' => $queue_item->ID,
                'post_status' => 'publish',
            ));
        }
    }
}