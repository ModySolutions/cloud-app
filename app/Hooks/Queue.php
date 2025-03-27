<?php

namespace App\Hooks;

use App\Hooks\Queue\Post;

class Queue
{
    public static function init(): void
    {
        add_action('init', Post::register_post_type(...));
        add_action('save_post_queue', Post::save_post_queue(...), 10, 3);
    }
}
