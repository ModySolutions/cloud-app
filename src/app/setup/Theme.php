<?php

namespace App\setup;

use function Env\env;

class Theme {
    public static function init(): void {
        add_action('init', self::wp_init(...), 100);
        add_action('after_setup_theme', self::after_Setup_theme(...));
        add_action('wp_enqueue_scripts', self::wp_enqueue_scripts(...), 100);
        add_action('template_redirect', self::template_redirect(...));
        add_action('admin_head', self::admin_head(...));
        add_action('wp_footer', self::wp_footer(...));
        add_action('admin_menu', self::admin_menu(...));
        add_action('after_switch_theme', self::after_switch_theme(...));
        add_filter('the_content', self::the_content(...), 30);
        add_filter('wpseo_debug_markers', '__return_false');
        add_filter('wpseo_metabox_prio', self::wpseo_metabox_prio(...));
    }

    public static function wp_init(): void {
        register_nav_menus([
            'header_menu' => __('Header menu'),
            'footer_top_menu' => __('Footer top menu'),
            'footer_bottom_menu' => __('Footer bottom menu')
        ]);

        remove_action('wp_head', 'feed_links_extra', 3);
        remove_action('wp_head', 'feed_links', 2);
        remove_action('wp_head', 'rsd_link');
        remove_action('wp_head', 'wlwmanifest_link');
        remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
        remove_action('wp_head', 'wp_generator');
        remove_action('wp_head', 'rest_output_link_wp_head');
        remove_action('wp_head', 'wp_oembed_add_discovery_links');
        remove_action('wp_head', 'wp_resource_hints', 2);
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('wp_print_styles', 'print_emoji_styles');
        remove_action('admin_print_scripts', 'print_emoji_detection_script');
        remove_action('admin_print_styles', 'print_emoji_styles');

        wp_deregister_script('heartbeat');

        if(env('CHILD_SITE') || (!env('CHILD_SITE') && !current_user_can('administrator'))) {
            show_admin_bar(false);
        }
    }

    public static function after_setup_theme(): void {
        add_theme_support('post-thumbnails');
        add_theme_support('title-tag');
    }

    public static function wp_enqueue_scripts(): void {
        foreach (self::_scripts() as $script) {
            wp_register_script(
                $script['handle'],
                $script['url'],
                $script['deps'],
                $script['ver'],
                $script['args']
            );
            wp_localize_script($script['handle'], 'App', [
                'network_url' => network_home_url(),
                'site_url' => site_url(),
                'ajax_url' => admin_url('admin-ajax.php'),
            ]);
            wp_enqueue_script($script['handle']);
        }

        foreach (self::_styles() as $style) {
            wp_register_style(
                $style['handle'],
                $style['url'],
                $style['deps'],
                $style['ver'],
                $style['media']
            );
            wp_enqueue_style($style['handle']);
        }
    }

    public static function template_redirect(): void {
        if (is_category() || is_tag() || is_date() || is_author() || is_tax() || is_attachment()) {
            global $wp_query;
            $wp_query->set_404();
        }
    }

    public static function the_content(string $p): string {
        return preg_replace('/<p>\\s*?(<a rel=\"attachment.*?><img.*?><\\/a>|<img.*?>)?\\s*<\\/p>/s', '$1', $p);
    }

    public static function admin_head(): void {
        echo '<style>.yoast-notice-go-premium, .wpseo-metabox-buy-premium, .yoast_premium_upsell_admin_block, .wpseo_content_cell #sidebar {display: none;}</style>';
    }

    public static function wp_footer(): void {
        wp_deregister_script('wp-embed');
    }

    public static function admin_menu(): void {
        if (function_exists('remove_menu_page')) {
            remove_menu_page('edit-comments.php');
        }

        remove_filter('update_footer', 'core_update_footer');
    }

    public static function wpseo_metabox_prio(): string {
        return 'low';
    }

    private static function _scripts(): array {
        $app = include(APP_THEME_DIR.'/dist/app.asset.php');
        return [
            [
                'handle' => 'app',
                'url' => APP_THEME_URL.'/dist/app.js',
                'ver' => $app['version'],
                'deps' => $app['dependencies'],
                'args' => ['in_footer' => true, 'defer' => true]
            ]
        ];
    }

    private static function _styles(): array {
        $app = include(APP_THEME_DIR.'/dist/app.asset.php');
        return [
            [
                'handle' => 'app',
                'url' => APP_THEME_URL.'/dist/app.css',
                'ver' => $app['version'],
                'deps' => null,
                'media' => 'all'
            ]
        ];
    }

    public static function after_switch_theme(): void {
        if (get_option('scaffold_defaultPosts')) {
            return;
        }
        wp_delete_post(1, true);// Sample Post
        wp_delete_post(2, true);// Sample Page
        wp_delete_post(3, true);// Privacy Policy Page
        wp_delete_comment(1, true);// Sample Comment

        self::_add_home_page();
        self::_add_auth_page();
        self::_add_wizard_page();
        self::_activate_current_user();

        add_option('scaffold_defaultPosts', 'removed');
    }

    private static function _add_home_page(): void {
        $home_page = array(
            'ID' => 1,
            'post_type' => 'page',
            'post_title' => 'Dashboard',
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => '',
        );
        $post_id = wp_insert_post($home_page);
        update_option('page_on_front', $post_id);
        update_option('show_on_front', 'page');
        update_post_meta($post_id, '_yoast_wpseo_metadesc', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    }

    private static function _add_auth_page(): void {
        wp_insert_post([
            'ID' => 2,
            'post_type' => 'page',
            'post_title' => 'Auth',
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'auth',
            'page_template' => 'auth-template.php',
            'post_content' => '<!-- wp:app/auth {"name":"app/auth","data":[],"mode":"edit"} /-->'
        ]);
    }

    private static function _add_wizard_page(): void {
        wp_insert_post([
            'ID' => 3,
            'post_type' => 'page',
            'post_title' => 'Setup Wizard',
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'setup-wizard',
            'page_template' => 'wizard-template.php',
            'post_content' => '<!-- wp:app/setup-wizard {"name":"app/setup-wizard","data":[],"mode":"edit"} /-->'
        ]);
    }

    private static function _activate_current_user(): void {
        $user = get_current_user();
        update_user_meta($user, '_user_is_active', 1);
    }
}