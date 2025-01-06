<?php

namespace App\Controllers;

use App\Controllers\Queue\Post;
use function Env\env;

class Queue_Controller {
    public static function init(): void {
        add_action('save_post_queue', Post::save_post_queue(...), 10, 3);
    }
}