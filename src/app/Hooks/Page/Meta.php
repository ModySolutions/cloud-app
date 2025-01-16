<?php

namespace App\Hooks\Page;

class Meta {
    public static function rest_api_init() : void {
        register_rest_field('page', 'routes', array(
            'get_callback' => self::get_routes(...),
        ));
    }

    public static function get_routes(array $page) : array {
        $routes = get_post_meta($page['id'], 'routes', true);
        return !!$routes ? $routes : array();
    }
}