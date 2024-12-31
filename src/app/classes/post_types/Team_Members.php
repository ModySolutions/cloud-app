<?php

namespace App\classes\post_types;

class Team_Members
{
    public static function init(): void
    {
        self::action();
    }

    public static function action(): void
    {
        add_action('init', self::register_post_type(...));
        add_filter('app_before_render_block', self::app_before_render_block(...));
    }

    public static function register_post_type(): void
    {
        register_post_type('team-member', array(
            'label' => __('Team Member', APP_THEME_LOCALE),
            'labels' => array(
                'name' => __('Members', APP_THEME_LOCALE),
                'singular_name' => __('Member', APP_THEME_LOCALE),
            ),
            'public' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'show_ui' => true,
            'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z"/></svg>'),
            'supports' => array('title', 'thumbnail'),
            'has_archive' => true,
            'delete_with_user' => false,
        ));
    }

    public static function app_before_render_block(array $context) : array {
        if($context['block']['name'] !== 'acf/meet-our-team') return $context;
        $team_members = $context['fields']['team_members'] ?? [];
        if(count($team_members) === 0) return $context;
        $filtered_team_members = [];
        foreach($team_members as $team_member) {
            $filtered_team_members[] = [
                'title' => esc_html($team_member->post_title),
                'link' => get_permalink($team_member->ID),
                'picture' => get_the_post_thumbnail_url($team_member->ID, '300x300'),
            ];
        }
        $context['fields']['team_members'] = $filtered_team_members;
        return $context;
    }
}