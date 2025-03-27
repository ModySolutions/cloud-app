<?php

namespace App\Hooks\Queue;

class Cron
{
    public static function process(): void
    {
        $queue_items = get_posts([
            'post_type' => 'queue',
            'post_status' => 'draft',
        ]);

        if (count($queue_items) === 0) {
            return;
        }

        foreach ($queue_items as $queue_item) {
            wp_update_post([
                'ID' => $queue_item->ID,
                'post_status' => 'publish',
            ]);
        }
    }
}
