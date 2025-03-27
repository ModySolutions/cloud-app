<?php

use Roots\WPConfig\Config;

if (!function_exists('app_get_user_uuid')) {
    function app_get_user_uuid(
        int|\WP_User|null $user = null,
    ): string|null {
        $user_id = $user?->ID ?? $user ?? get_current_user_id();
        if (!$user_id) {
            return null;
        }

        return get_user_meta($user_id, 'uuid', true);
    }
}


if (!function_exists('app_get_post_uuid')) {
    function app_get_post_uuid(
        int|\WP_Post|null $post = null,
    ): string|null {
        $post_id = $post?->ID ?? $post ?? get_the_ID();
        if (!$post_id) {
            return null;
        }

        return get_post_meta($post_id, 'uuid', true);
    }
}

if (!function_exists('app_uuid_exists')) {
    function app_uuid_exists(string $uuid_string): bool
    {
        $exists = false;
        $space_directory = app_get_uuid_path();
        $stored_uuids = glob($space_directory . '/*.uuid.json');
        if (count($stored_uuids)) {
            $stored_uuids_basename = array_map(function ($uuid_item) use ($uuid_string) {
                $basename = basename($uuid_item, '.uuid.json');
                $exploded_name = explode('.', $basename);
                return $exploded_name[0];
            }, $stored_uuids);
            $exists = in_array($uuid_string, $stored_uuids_basename);
        }

        return $exists;
    }
}

if (!function_exists('app_get_uuid_path')) {
    function app_get_uuid_path(): string
    {
        $uuid_path = Config::get('MC_UUID_PATH');
        if (Config::get('SPACE_PATH')) {
            $uuid_path = Config::get('SPACE_PATH') . '/uuid';
        }
        return $uuid_path;
    }
}

if (!function_exists('app_get_user_uuid_file_name')) {
    function app_get_user_uuid_file_name(
        string $uuid,
        int $id = null,
    ): string {
        return Config::get('MC_UUID_PATH') . "/{$uuid}.{$id}.user.uuid.json";
    }
}

if (!function_exists('app_get_user_uuid_files')) {
    function app_get_user_uuid_files($uuid): array
    {
        return glob(Config::get('MC_UUID_PATH') . "/{$uuid}.*.user.uuid.json");
    }
}
