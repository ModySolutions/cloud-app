<?php

namespace App\Controllers\Sites;

class Block {
    public static function app_before_render_block(array $context) : array {
        if(!is_user_logged_in()) {
            wp_redirect(wp_login_url());
            exit;
        }

        if(current_user_can('administrator')) {
            return $context;
        }


        $account = include(APP_THEME_DIR.'/dist/site.asset.php');
        foreach($account['dependencies'] as $dependency) {
            wp_enqueue_script($dependency);
        }
        wp_enqueue_script(
            'site',
            APP_THEME_URL.'/dist/site.js',
            $account['version'],
            $account['dependencies'],
            ['in_footer' => true, 'type' => 'module']
        );

        $current_user_id = get_current_user_id();
        $site_id = app_user_has_a_site($current_user_id);
        $site_uri = get_field('site_uri', $site_id);
        $site_is_active = $site_id && app_site_is_active($site_id);

        if($site_id && $site_is_active) {
            wp_redirect($site_uri);
            exit;
        } elseif($site_id && !$site_is_active) {
            $space_install_setup = add_query_arg(array(
                'key' => base64_encode(md5(rand(11111,99999))),
                'installing' => true,
            ), "{$site_uri}/app/space-install-setup.php");
            wp_redirect($space_install_setup);
            exit;
        }
        return $context;
    }
}