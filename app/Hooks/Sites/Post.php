<?php

namespace App\Hooks\Sites;

class Post
{
    public static function register_post_type(): void
    {
        register_post_type('site', [
            'labels' => [
                'name' => __('Sites', APP_THEME_LOCALE),
                'singular_name' => __('Site', APP_THEME_LOCALE),
                'menu_name' => __('Sites', APP_THEME_LOCALE),
                'all_items' => __('All Sites', APP_THEME_LOCALE),
                'edit_item' => __('Edit Site', APP_THEME_LOCALE),
                'view_item' => __('View Site', APP_THEME_LOCALE),
                'view_items' => __('View Sites', APP_THEME_LOCALE),
                'add_new_item' => __('Add New Site', APP_THEME_LOCALE),
                'add_new' => __('Add New Site', APP_THEME_LOCALE),
                'new_item' => __('New Site', APP_THEME_LOCALE),
                'parent_item_colon' => __('Parent Site:', APP_THEME_LOCALE),
                'search_items' => __('Search Sites', APP_THEME_LOCALE),
                'not_found' => __('No sites found', APP_THEME_LOCALE),
                'not_found_in_trash' => __('No sites found in Trash', APP_THEME_LOCALE),
                'archives' => __('Site Archives', APP_THEME_LOCALE),
                'attributes' => __('Site Attributes', APP_THEME_LOCALE),
                'insert_into_item' => __('Insert into site', APP_THEME_LOCALE),
                'uploaded_to_this_item' => __('Uploaded to this site', APP_THEME_LOCALE),
                'filter_items_list' => __('Filter sites list', APP_THEME_LOCALE),
                'filter_by_date' => __('Filter sites by date', APP_THEME_LOCALE),
                'items_list_navigation' => __('Sites list navigation', APP_THEME_LOCALE),
                'items_list' => __('Sites list', APP_THEME_LOCALE),
                'item_published' => __('Site published.', APP_THEME_LOCALE),
                'item_published_privately' => __('Site published privately.', APP_THEME_LOCALE),
                'item_reverted_to_draft' => __('Site reverted to draft.', APP_THEME_LOCALE),
                'item_scheduled' => __('Site scheduled.', APP_THEME_LOCALE),
                'item_updated' => __('Site updated.', APP_THEME_LOCALE),
                'item_link' => __('Site Link', APP_THEME_LOCALE),
                'item_link_description' => __('A link to a site.', APP_THEME_LOCALE),
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => true,
            'menu_position' => 6,
            'menu_icon' => 'dashicons-admin-multisite',
            'supports' => [
                0 => 'title',
                1 => 'author',
            ],
            'rewrite' => [
                'with_front' => false,
                'pages' => false,
            ],
            'delete_with_user' => true,
        ]);
    }
}
