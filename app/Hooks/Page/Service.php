<?php

namespace App\Hooks\Page;

class Service
{
    public static function rest_api_init(): void
    {
        register_rest_field('page', 'routes', [
            'get_callback' => self::get_routes(...),
        ]);
        register_rest_field('page', 'call_to_action', [
            'get_callback' => self::get_call_to_action(...),
        ]);
    }

    public static function get_routes(array $page): array
    {
        $routes = get_post_meta($page['id'], 'routes', true);
        return !!$routes ? $routes : [];
    }

    public static function get_call_to_action(array $page): array
    {
        $call_to_action = get_post_meta($page['id'], 'call_to_action', true);
        return !!$call_to_action ? $call_to_action : [];
    }
}
