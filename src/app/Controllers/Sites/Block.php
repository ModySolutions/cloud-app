<?php

namespace App\Controllers\Sites;

class Block {
    public static function app_before_render_block(array $context) : array {
        $current_user_id = get_current_user_id();
        $user_has_a_site = get_posts(array(
            'post_type' => 'site',
            'author' => $current_user_id,
            'posts_per_page' => 1,
        ));

        if(count($user_has_a_site) > 0) {
            $site = $user_has_a_site[0];
            $site_uri = get_field('site_uri', $site->ID);
            wp_redirect($site_uri);
            exit;
        }
        return $context;
    }
}