<?php

namespace App\Controllers\Sites;

class Cron {
    public static function process() : void {
        if (get_option('scaffold_default_posts')) {
            return;
        }

        app_log(
            sprintf(
                __('finish_site_setup: Installing %s'),
                get_bloginfo(),
            )
        );

        self::_scaffold_default_posts();
        self::_activate_first_user();
        self::_update_options();

        add_option('scaffold_default_posts', 'removed');
    }

    private static function _scaffold_default_posts(): void {
        wp_delete_post(1, true);
        wp_delete_post(2, true);
        wp_delete_post(3, true);
        wp_delete_comment(1, true);

        self::_add_home_page();
        self::_add_auth_page();
        self::_add_dashboard_page();
        self::_add_apps_page();
        self::_add_users_page();
        self::_add_settings_page();
        self::_add_activity_page();
        self::_add_support_page();
    }

    private static function _add_home_page(): void {
        $home_page_id = wp_insert_post(array(
            'post_type' => 'page',
            'post_title' => 'Home',
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => '',
            'page_template' => 'home.php'
        ));
        update_option('page_on_front', $home_page_id);
        update_option('show_on_front', 'page');
    }

    private static function _add_auth_page(): void {
        $auth_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => 'Auth',
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'auth',
            'page_template' => 'auth-template.php',
            'post_content' => '<!-- wp:app/auth {"name":"app/auth","data":[],"mode":"edit"} /-->'
        ]);
        update_option('authentication_page_id', $auth_page_id);
    }

    private static function _add_dashboard_page(): void {
        $dashboard_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Dashboard'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'dashboard',
            'post_content' => '<!-- wp:app/dashboard {"name":"app/dashboard","data":[],"mode":"edit"} /-->'
        ]);
        update_option('dashboard_page_id', $dashboard_page_id);
    }

    private static function _add_apps_page(): void {
        $apps_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Apps'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'apps',
            'post_content' => '<!-- wp:app/apps {"name":"app/apps","data":[],"mode":"edit"} /-->'
        ]);
        update_option('apps_page_id', $apps_page_id);
    }

    private static function _add_users_page(): void {
        $users_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Users'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'users',
            'post_content' => '<!-- wp:app/users {"name":"app/users","data":[],"mode":"edit"} /-->'
        ]);
        update_option('users_page_id', $users_page_id);
    }

    private static function _add_settings_page(): void {
        $settings_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Settings'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'settings',
            'post_content' => '<!-- wp:app/settings {"name":"app/settings","data":[],"mode":"edit"} /-->'
        ]);
        update_option('settings_page_id', $settings_page_id);
    }

    private static function _add_activity_page(): void {
        $activity_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Activity'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'activity',
            'post_content' => '<!-- wp:app/activity {"name":"app/activity","data":[],"mode":"edit"} /-->'
        ]);
        update_option('activity_page_id', $activity_page_id);
    }

    private static function _add_support_page(): void {
        $support_page_id = wp_insert_post([
            'post_type' => 'page',
            'post_title' => __('Support'),
            'post_status' => 'publish',
            'post_author' => 1,
            'post_name' => 'support',
            'post_content' => '<!-- wp:app/support {"name":"app/support","data":[],"mode":"edit"} /-->'
        ]);
        update_option('support_page_id', $support_page_id);
    }

    private static function _activate_first_user(): void {
        $user_id = 1;
        $user = get_user($user_id);
        $email = $user->user_email;
        $file_name = base64_encode($email) . '.txt';
        $file_path = MC_USERS_PATH . "/$file_name";
        if(is_file($file_path)) {
            global $wpdb;
            $password_hash = file_get_contents($file_path);
            $wpdb->query(
                $wpdb->prepare(
                    "UPDATE {$wpdb->prefix}"."users SET user_pass = %s WHERE ID = %d",
                    $password_hash,
                    $user_id
                )
            );
        }
        update_user_meta($user_id, '_user_is_active', 1);
    }

    private static function _update_options() : void {
        update_option('timezone_string', 'Europe/Madrid');
        update_option('permalink_structure', '/%postname%/');
        update_option('rewrite_rules', self::_serialize_permastructure());
        update_option('WPLANG', 'es_ES');
        update_option('options_block_wp_admin_access', '1');
        update_option('_options_block_wp_admin_access', 'field_67742075d700a');
        update_option('options_block_wp_login_access', '1');
        update_option('_options_block_wp_login_access', 'field_67742088d700b');
    }

    private static function _serialize_permastructure() : string {
        return '
a:133:{s:11:"^wp-json/?$";s:22:"index.php?rest_route=/";s:14:"^wp-json/(.*)?";s:33:"index.php?rest_route=/$matches[1]";s:21:"^index.php/wp-json/?$";s:22:"index.php?rest_route=/";s:24:"^index.php/wp-json/(.*)?";s:33:"index.php?rest_route=/$matches[1]";s:17:"^wp-sitemap\.xml$";s:23:"index.php?sitemap=index";s:17:"^wp-sitemap\.xsl$";s:36:"index.php?sitemap-stylesheet=sitemap";s:23:"^wp-sitemap-index\.xsl$";s:34:"index.php?sitemap-stylesheet=index";s:48:"^wp-sitemap-([a-z]+?)-([a-z\d_-]+?)-(\d+?)\.xml$";s:75:"index.php?sitemap=$matches[1]&sitemap-subtype=$matches[2]&paged=$matches[3]";s:34:"^wp-sitemap-([a-z]+?)-(\d+?)\.xml$";s:47:"index.php?sitemap=$matches[1]&paged=$matches[2]";s:19:"^([^/]+)/sign-in/?$";s:45:"index.php?pagename=$matches[1]&action=sign-in";s:19:"^([^/]+)/sign-up/?$";s:45:"index.php?pagename=$matches[1]&action=sign-up";s:25:"^([^/]+)/forgot-passwd/?$";s:51:"index.php?pagename=$matches[1]&action=forgot-passwd";s:24:"^([^/]+)/reset-passwd/?$";s:50:"index.php?pagename=$matches[1]&action=reset-passwd";s:47:"category/(.+?)/feed/(feed|rdf|rss|rss2|atom)/?$";s:52:"index.php?category_name=$matches[1]&feed=$matches[2]";s:42:"category/(.+?)/(feed|rdf|rss|rss2|atom)/?$";s:52:"index.php?category_name=$matches[1]&feed=$matches[2]";s:23:"category/(.+?)/embed/?$";s:46:"index.php?category_name=$matches[1]&embed=true";s:35:"category/(.+?)/page/?([0-9]{1,})/?$";s:53:"index.php?category_name=$matches[1]&paged=$matches[2]";s:17:"category/(.+?)/?$";s:35:"index.php?category_name=$matches[1]";s:44:"tag/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:42:"index.php?tag=$matches[1]&feed=$matches[2]";s:39:"tag/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:42:"index.php?tag=$matches[1]&feed=$matches[2]";s:20:"tag/([^/]+)/embed/?$";s:36:"index.php?tag=$matches[1]&embed=true";s:32:"tag/([^/]+)/page/?([0-9]{1,})/?$";s:43:"index.php?tag=$matches[1]&paged=$matches[2]";s:14:"tag/([^/]+)/?$";s:25:"index.php?tag=$matches[1]";s:45:"type/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:50:"index.php?post_format=$matches[1]&feed=$matches[2]";s:40:"type/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:50:"index.php?post_format=$matches[1]&feed=$matches[2]";s:21:"type/([^/]+)/embed/?$";s:44:"index.php?post_format=$matches[1]&embed=true";s:33:"type/([^/]+)/page/?([0-9]{1,})/?$";s:51:"index.php?post_format=$matches[1]&paged=$matches[2]";s:15:"type/([^/]+)/?$";s:33:"index.php?post_format=$matches[1]";s:33:"queue/[^/]+/attachment/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:43:"queue/[^/]+/attachment/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:63:"queue/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:58:"queue/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:58:"queue/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:39:"queue/[^/]+/attachment/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:22:"queue/([^/]+)/embed/?$";s:38:"index.php?queue=$matches[1]&embed=true";s:26:"queue/([^/]+)/trackback/?$";s:32:"index.php?queue=$matches[1]&tb=1";s:34:"queue/([^/]+)/page/?([0-9]{1,})/?$";s:45:"index.php?queue=$matches[1]&paged=$matches[2]";s:41:"queue/([^/]+)/comment-page-([0-9]{1,})/?$";s:45:"index.php?queue=$matches[1]&cpage=$matches[2]";s:30:"queue/([^/]+)(?:/([0-9]+))?/?$";s:44:"index.php?queue=$matches[1]&page=$matches[2]";s:22:"queue/[^/]+/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:32:"queue/[^/]+/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:52:"queue/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:47:"queue/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:47:"queue/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:28:"queue/[^/]+/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:32:"site/[^/]+/attachment/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:42:"site/[^/]+/attachment/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:62:"site/[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:57:"site/[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:57:"site/[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:38:"site/[^/]+/attachment/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:21:"site/([^/]+)/embed/?$";s:37:"index.php?site=$matches[1]&embed=true";s:25:"site/([^/]+)/trackback/?$";s:31:"index.php?site=$matches[1]&tb=1";s:33:"site/([^/]+)/page/?([0-9]{1,})/?$";s:44:"index.php?site=$matches[1]&paged=$matches[2]";s:40:"site/([^/]+)/comment-page-([0-9]{1,})/?$";s:44:"index.php?site=$matches[1]&cpage=$matches[2]";s:29:"site/([^/]+)(?:/([0-9]+))?/?$";s:43:"index.php?site=$matches[1]&page=$matches[2]";s:21:"site/[^/]+/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:31:"site/[^/]+/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:51:"site/[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:46:"site/[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:46:"site/[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:27:"site/[^/]+/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:12:"robots\.txt$";s:18:"index.php?robots=1";s:13:"favicon\.ico$";s:19:"index.php?favicon=1";s:12:"sitemap\.xml";s:24:"index.php??sitemap=index";s:48:".*wp-(atom|rdf|rss|rss2|feed|commentsrss2)\.php$";s:18:"index.php?feed=old";s:20:".*wp-app\.php(/.*)?$";s:19:"index.php?error=403";s:18:".*wp-register.php$";s:23:"index.php?register=true";s:32:"feed/(feed|rdf|rss|rss2|atom)/?$";s:27:"index.php?&feed=$matches[1]";s:27:"(feed|rdf|rss|rss2|atom)/?$";s:27:"index.php?&feed=$matches[1]";s:8:"embed/?$";s:21:"index.php?&embed=true";s:20:"page/?([0-9]{1,})/?$";s:28:"index.php?&paged=$matches[1]";s:27:"comment-page-([0-9]{1,})/?$";s:38:"index.php?&page_id=6&cpage=$matches[1]";s:41:"comments/feed/(feed|rdf|rss|rss2|atom)/?$";s:42:"index.php?&feed=$matches[1]&withcomments=1";s:36:"comments/(feed|rdf|rss|rss2|atom)/?$";s:42:"index.php?&feed=$matches[1]&withcomments=1";s:17:"comments/embed/?$";s:21:"index.php?&embed=true";s:44:"search/(.+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:40:"index.php?s=$matches[1]&feed=$matches[2]";s:39:"search/(.+)/(feed|rdf|rss|rss2|atom)/?$";s:40:"index.php?s=$matches[1]&feed=$matches[2]";s:20:"search/(.+)/embed/?$";s:34:"index.php?s=$matches[1]&embed=true";s:32:"search/(.+)/page/?([0-9]{1,})/?$";s:41:"index.php?s=$matches[1]&paged=$matches[2]";s:14:"search/(.+)/?$";s:23:"index.php?s=$matches[1]";s:47:"author/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:50:"index.php?author_name=$matches[1]&feed=$matches[2]";s:42:"author/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:50:"index.php?author_name=$matches[1]&feed=$matches[2]";s:23:"author/([^/]+)/embed/?$";s:44:"index.php?author_name=$matches[1]&embed=true";s:35:"author/([^/]+)/page/?([0-9]{1,})/?$";s:51:"index.php?author_name=$matches[1]&paged=$matches[2]";s:17:"author/([^/]+)/?$";s:33:"index.php?author_name=$matches[1]";s:69:"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$";s:80:"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]";s:64:"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$";s:80:"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&feed=$matches[4]";s:45:"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/embed/?$";s:74:"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&embed=true";s:57:"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/page/?([0-9]{1,})/?$";s:81:"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&paged=$matches[4]";s:39:"([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/?$";s:63:"index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]";s:56:"([0-9]{4})/([0-9]{1,2})/feed/(feed|rdf|rss|rss2|atom)/?$";s:64:"index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]";s:51:"([0-9]{4})/([0-9]{1,2})/(feed|rdf|rss|rss2|atom)/?$";s:64:"index.php?year=$matches[1]&monthnum=$matches[2]&feed=$matches[3]";s:32:"([0-9]{4})/([0-9]{1,2})/embed/?$";s:58:"index.php?year=$matches[1]&monthnum=$matches[2]&embed=true";s:44:"([0-9]{4})/([0-9]{1,2})/page/?([0-9]{1,})/?$";s:65:"index.php?year=$matches[1]&monthnum=$matches[2]&paged=$matches[3]";s:26:"([0-9]{4})/([0-9]{1,2})/?$";s:47:"index.php?year=$matches[1]&monthnum=$matches[2]";s:43:"([0-9]{4})/feed/(feed|rdf|rss|rss2|atom)/?$";s:43:"index.php?year=$matches[1]&feed=$matches[2]";s:38:"([0-9]{4})/(feed|rdf|rss|rss2|atom)/?$";s:43:"index.php?year=$matches[1]&feed=$matches[2]";s:19:"([0-9]{4})/embed/?$";s:37:"index.php?year=$matches[1]&embed=true";s:31:"([0-9]{4})/page/?([0-9]{1,})/?$";s:44:"index.php?year=$matches[1]&paged=$matches[2]";s:13:"([0-9]{4})/?$";s:26:"index.php?year=$matches[1]";s:27:".?.+?/attachment/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:37:".?.+?/attachment/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:57:".?.+?/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:52:".?.+?/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:52:".?.+?/attachment/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:33:".?.+?/attachment/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:16:"(.?.+?)/embed/?$";s:41:"index.php?pagename=$matches[1]&embed=true";s:20:"(.?.+?)/trackback/?$";s:35:"index.php?pagename=$matches[1]&tb=1";s:40:"(.?.+?)/feed/(feed|rdf|rss|rss2|atom)/?$";s:47:"index.php?pagename=$matches[1]&feed=$matches[2]";s:35:"(.?.+?)/(feed|rdf|rss|rss2|atom)/?$";s:47:"index.php?pagename=$matches[1]&feed=$matches[2]";s:28:"(.?.+?)/page/?([0-9]{1,})/?$";s:48:"index.php?pagename=$matches[1]&paged=$matches[2]";s:35:"(.?.+?)/comment-page-([0-9]{1,})/?$";s:48:"index.php?pagename=$matches[1]&cpage=$matches[2]";s:24:"(.?.+?)(?:/([0-9]+))?/?$";s:47:"index.php?pagename=$matches[1]&page=$matches[2]";s:27:"[^/]+/attachment/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:37:"[^/]+/attachment/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:57:"[^/]+/attachment/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:52:"[^/]+/attachment/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:52:"[^/]+/attachment/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:33:"[^/]+/attachment/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";s:16:"([^/]+)/embed/?$";s:37:"index.php?name=$matches[1]&embed=true";s:20:"([^/]+)/trackback/?$";s:31:"index.php?name=$matches[1]&tb=1";s:40:"([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:43:"index.php?name=$matches[1]&feed=$matches[2]";s:35:"([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:43:"index.php?name=$matches[1]&feed=$matches[2]";s:28:"([^/]+)/page/?([0-9]{1,})/?$";s:44:"index.php?name=$matches[1]&paged=$matches[2]";s:35:"([^/]+)/comment-page-([0-9]{1,})/?$";s:44:"index.php?name=$matches[1]&cpage=$matches[2]";s:24:"([^/]+)(?:/([0-9]+))?/?$";s:43:"index.php?name=$matches[1]&page=$matches[2]";s:16:"[^/]+/([^/]+)/?$";s:32:"index.php?attachment=$matches[1]";s:26:"[^/]+/([^/]+)/trackback/?$";s:37:"index.php?attachment=$matches[1]&tb=1";s:46:"[^/]+/([^/]+)/feed/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:41:"[^/]+/([^/]+)/(feed|rdf|rss|rss2|atom)/?$";s:49:"index.php?attachment=$matches[1]&feed=$matches[2]";s:41:"[^/]+/([^/]+)/comment-page-([0-9]{1,})/?$";s:50:"index.php?attachment=$matches[1]&cpage=$matches[2]";s:22:"[^/]+/([^/]+)/embed/?$";s:43:"index.php?attachment=$matches[1]&embed=true";}';
    }
}