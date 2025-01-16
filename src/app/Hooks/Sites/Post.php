<?php

namespace App\Hooks\Sites;

class Post {
    public static function register_post_type() : void {
        register_post_type( 'site', array(
            'labels' => array(
                'name' => __('Sites'),
                'singular_name' => __('Site'),
                'menu_name' => __('Sites'),
                'all_items' => __('All Sites'),
                'edit_item' => __('Edit Site'),
                'view_item' => __('View Site'),
                'view_items' => __('View Sites'),
                'add_new_item' => __('Add New Site'),
                'add_new' => __('Add New Site'),
                'new_item' => __('New Site'),
                'parent_item_colon' => __('Parent Site:'),
                'search_items' => __('Search Sites'),
                'not_found' => __('No sites found'),
                'not_found_in_trash' => __('No sites found in Trash'),
                'archives' => __('Site Archives'),
                'attributes' => __('Site Attributes'),
                'insert_into_item' => __('Insert into site'),
                'uploaded_to_this_item' => __('Uploaded to this site'),
                'filter_items_list' => __('Filter sites list'),
                'filter_by_date' => __('Filter sites by date'),
                'items_list_navigation' => __('Sites list navigation'),
                'items_list' => __('Sites list'),
                'item_published' => __('Site published.'),
                'item_published_privately' => __('Site published privately.'),
                'item_reverted_to_draft' => __('Site reverted to draft.'),
                'item_scheduled' => __('Site scheduled.'),
                'item_updated' => __('Site updated.'),
                'item_link' => __('Site Link'),
                'item_link_description' => __('A link to a site.'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => true,
            'menu_position' => 6,
            'menu_icon' => 'dashicons-admin-multisite',
            'supports' => array(
                0 => 'title',
                1 => 'author',
            ),
            'rewrite' => array(
                'with_front' => false,
                'pages' => false,
            ),
            'delete_with_user' => true,
        ) );
    }
}