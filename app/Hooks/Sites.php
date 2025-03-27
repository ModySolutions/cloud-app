<?php

namespace App\Hooks;

use App\Hooks\Sites\Ajax;
use App\Hooks\Sites\Block;
use App\Hooks\Sites\Post;
use App\Hooks\Sites\Routes;
use Roots\WPConfig\Config;

class Sites
{
    public const LAST_UPDATE = 'Dool|Tinky|Sonya|Simple';
    public const CREATE_SITE_PAGE_CONTENT = <<<EOF
<!-- wp:group {"className":"wizard-form flex flex-column justify-center p-4 rounded radius-md bg-white","layout":{"type":"constrained"}} -->
<div class="wp-block-group wizard-form flex flex-column justify-center p-4 rounded radius-md bg-white"><!-- wp:image {"width":"200px","sizeSlug":"medium","linkDestination":"none","align":"center"} -->
<figure class="wp-block-image aligncenter size-medium is-resized"><img src="https://modycloud.test/content/uploads/2024/12/logo-mody-cloud-300x148.png" alt="" class="wp-image-51" style="width:200px"/></figure>
<!-- /wp:image -->

<!-- wp:app/create-site-v2 -->
<p class="wp-block-app-create-site-v2">Auth Module for Mody Cloud</p>
<!-- /wp:app/create-site-v2 --></div>
<!-- /wp:group -->
EOF;

    public static function init(): void
    {
        add_action('init', self::wp_init(...));
        add_action('init', Routes::permalink_structure(...));
        add_action('init', Post::register_post_type(...));
        add_action('wp_install', Routes::migrate(...));
        add_action('wp_ajax_check_setup_finished', Ajax::check_setup_finished(...));
        add_action('wp_ajax_check_space_name_exists', Ajax::check_space_name_exists(...));
        add_action('wp_ajax_create_space', Ajax::create_space(...));
        add_filter('app_before_render_block_create-site', Block::app_before_render_block(...));
        add_filter('render_block', Block::app_render_block(...), 10, 3);
    }

    public static function wp_init(): void
    {
        if (Config::get('CHILD_SITE')) {
            return;
        }
        $get_post_by_name = get_page_by_path('create-site');
        $create_site_page_id_option = get_option('create_site_page_id');
        if ($get_post_by_name?->ID && $create_site_page_id_option !== $get_post_by_name?->ID) {
            $create_site_page_id = $get_post_by_name?->ID;
        } else {
            $create_site_page_id = $create_site_page_id_option;
        }
        $create_site_option_last_update = get_option('create_site_option_last_update');
        if (! $create_site_page_id || $create_site_option_last_update !== self::LAST_UPDATE) {
            if (!$create_site_page_id) {
                $create_site_page_id = wp_insert_post([
                    'post_type' => 'page',
                    'post_title' => __('Create site', APP_THEME_LOCALE),
                    'post_status' => 'publish',
                    'post_author' => 1,
                    'post_name' => 'create_site',
                    'post_content' => self::CREATE_SITE_PAGE_CONTENT,
                ]);
            }

            wp_update_post([
                'ID' => $create_site_page_id,
                'post_content' => self::CREATE_SITE_PAGE_CONTENT,
            ]);

            update_option('create_site_option_last_update', self::LAST_UPDATE);
            update_option('create_site_page_id', $create_site_page_id);
        }
    }
}
