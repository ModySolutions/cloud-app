<?php

namespace App\Hooks;

use Ramsey\Uuid\Uuid;
use function Env\env;

class PostHooks {
    public static function init() : void {
        add_action('save_post', self::save_post(...), 10, 3);
        add_filter('home_url', self::filter_the_permalink(...));
    }

    public static function save_post(int $post_id, \WP_Post $post, bool $update) : void {
        $uuid_string = get_post_meta($post_id, 'uuid', true);
        if(!$uuid_string) {
            do {
                $uuid = Uuid::uuid4();
                $uuid_string = $uuid->toString();
            } while(self::uuid_exists($uuid_string));
        }
        $space_name = env('SPACE_NAME') ?? 'modycloud';
        $uuid_file_name = MC_UUID_PATH . "/{$uuid_string}.{$space_name}.{$post_id}.{$post->post_type}.uuid.json";

        if(!is_dir(MC_UUID_PATH)) {
            mkdir(MC_UUID_PATH);
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
    
    public static function uuid_exists(string $uuid_string) : bool {
        $exists = false;
        $stored_uuids = glob(MC_UUID_PATH . '/*.uuid.json');
        if(count($stored_uuids)) {
            $stored_uuids_basename = array_map(function($uuid_item) use ($uuid_string){
                $basename = basename($uuid_item, '.uuid.json');
                $exploded_name = explode('.', $basename);
                return $exploded_name[0];
            }, $stored_uuids);
            $exists = in_array($uuid_string, $stored_uuids_basename);
        }

        return $exists;
    }
}