<?php

require_once '../wp/wp-load.php';
require_once '../../app/helpers/migrations.php';

$last_migration = app_get_last_migration_from_code();
$has_last_migration_run = app_has_last_migration_run($last_migration);

app_log(sprintf('Last migration is %s', $last_migration));
app_log(sprintf('Last migration run is %s', $has_last_migration_run));

$dashboard_page_id = get_option('dashboard_page_id');
$initial_page = get_permalink($dashboard_page_id);

$site_name = get_bloginfo();

if ($has_last_migration_run) {
    do_action('admin_init');
    $uuid = array_key_exists('uuid', $_GET) ? sanitize_text_field($_GET['uuid']) : null;
    $user_id = 1;
    update_user_meta($user_id, 'uuid', $uuid);
    $file = "../../config/users/{$uuid}.json";
    if (file_exists($file)) {
        $user_data = json_decode(file_get_contents($file));
        $user_id = $user_data?->wp_user?->ID;
        $password_hash = get_user_meta($user_id, 'password_hash', true);
        $initial_page = app_get_initial_page(get_user($user_id));
        if ($password_hash !== $user_data?->password_hash && $user_data?->new_password) {
            global $wpdb;
            $wpdb->update($wpdb->users, [
                'user_pass' => $user_data?->new_password,
            ], ['ID' => $user_id]);
        }
    }
} else {
    \App\Hooks\Migrations\Cron::migrate();
}

$messages = [
    __('Creating database...'),
    __('Creating admin user...'),
    __('Creating default pages...'),
    __('Creating frontend routes...'),
    __('Setting up permalinks...'),
    __('Huh! It\s been a long time...'),
    __('I got somewhere to be man...'),
    __('Oh! You\re still here? Man, what am I doing?...'),
];
wp_send_json_success([
    'done' => $has_last_migration_run,
    'status' => "Site {$site_name} current migration: {$last_migration}",
    'initial_page' => $initial_page,
    'message' => $messages[$_GET['i'] ? sanitize_text_field($_GET['i']) : rand(0, 7)],
]);
