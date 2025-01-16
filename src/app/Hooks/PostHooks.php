<?php

namespace App\Hooks;

use Ramsey\Uuid\Uuid;

class PostHooks {
    public static function init() : void {
        add_action('save_post', self::save_post(...), 10, 3);
    }

    public static function save_post(int $post_id, \WP_Post $post, bool $update) : void {
        $stored_uuid = get_post_meta($post_id, 'uuid', true);
        if($update && $stored_uuid) { return; }

        if(!is_dir(MC_UUID_PATH)) {
            mkdir(MC_UUID_PATH);
        }

        function uuid_exists(string $uuid_string) : bool {
            $exists = false;
            $stored_uuids = glob(MC_UUID_PATH . '/*');
            if(count($stored_uuids)) {
                $stored_uuids_basename = array_map(function($uuid_item) use ($uuid_string){
                    return basename($uuid_item);
                }, $stored_uuids);
                $exists = in_array($uuid_string, $stored_uuids_basename);
            }

            return $exists;
        }

        do {
            $uuid = Uuid::uuid4();
            $uuid_string = $uuid->toString();
        } while(uuid_exists($uuid_string));

        $uuid_file_name = MC_UUID_PATH . "/{$uuid_string}.uuid";
        if(!is_file($uuid_file_name)){
            touch($uuid_file_name);
        }
        file_put_contents($uuid_file_name, $uuid_string);
        update_post_meta($post_id, 'uuid', $uuid_string);
    }
}