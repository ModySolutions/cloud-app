<?php

require_once '../wp/wp-load.php';
require_once '../../app/helpers/migrations.php';

$last_migration = app_get_last_migration_from_code();
$has_last_migration_run = app_has_last_migration_run($last_migration);

$dashboard_page_id = get_option('dashboard_page_id');
$dashboard_page_url = get_permalink($dashboard_page_id);

$site_name = get_bloginfo();

if($has_last_migration_run) {
    wp_set_auth_cookie(1,1);
    do_action('admin_init');
}

$messages = array(
    __('Creating database...'),
    __('Creating admin user...'),
    __('Creating default pages...'),
    __('Creating creating frontend routes...'),
    __('Setting up permalinks...'),
    __('Huh! It\s been a long time...'),
    __('I got somewhere to be man...'),
    __('Oh! You\re still here? Man, what am I doing?...'),
);
wp_send_json_success(array(
    'done' => $has_last_migration_run,
    'status' => "Site {$site_name} current migration: {$last_migration}",
    'initial_page' => $dashboard_page_url,
    'message' => $messages[$_GET['i'] ? sanitize_text_field($_GET['i']) : rand(0, 7)],
));

