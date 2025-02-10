<?php

namespace App\Hooks;

use Ramsey\Uuid\Uuid;
use Roots\WPConfig\Config;
use function Env\env;

class Post {
    public static function init() : void {
        add_action('save_post', self::save_post(...), 10, 3);
        add_filter('home_url', self::filter_the_permalink(...));
    }

    public static function save_post(int $post_id, \WP_Post $post, bool $update) : void {
        $uuid_string = app_get_post_uuid($post_id);
        if(!$uuid_string) {
            do {
                $uuid = Uuid::uuid4();
                $uuid_string = $uuid->toString();
            } while(app_uuid_exists($uuid_string));
        }
        $space_name = Config::get('SPACE_NAME') ?? 'modycloud';
        $uuid_file_name = Config::get('MC_UUID_PATH') . "/{$uuid_string}.{$space_name}.{$post_id}.{$post->post_type}.uuid.json";

        $space_directory = app_get_uuid_path();

        if(!is_dir($space_directory)) {
            mkdir($space_directory, 0755, true);
        }

        if($uuid_string && !is_file($uuid_file_name)){
            touch($uuid_file_name);
        }

        file_put_contents($uuid_file_name, json_encode($post));
        update_post_meta($post_id, 'uuid', $uuid_string);
    }

    public static function filter_the_permalink(string $url) : string {
//        $current_site = env('WP_HOME');
//        $current_post_id = get_the_ID();
//        if($current_post_id) {
//            $app_filter_the_permalink = get_post_meta($current_post_id, 'app_filter_the_permalink', true);
//            if($app_filter_the_permalink) {
//                return str_replace($current_site, '', $url);
//            }
//        }
        return $url;
    }
}