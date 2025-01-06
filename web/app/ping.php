<?php

require_once '../wp/wp-load.php';

wp_send_json_success(array(
    'done' => !!get_option('scaffold_default_posts'),
));

