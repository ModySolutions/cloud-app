<?php

return function (\wpdb $wpdb) {
    $site_name = get_bloginfo();
    app_log("Starting installation for {$site_name}");
    app_log("\t->Deleting default content on {$site_name}");

    wp_delete_post(1, true);
    wp_delete_post(2, true);
    wp_delete_post(3, true);
    wp_delete_comment(1, true);

    app_log("\t->Adding homepage on {$site_name}");
    $home_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Home'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => '',
        'page_template' => 'home.php'
    ));
    update_option('page_on_front', $home_page_id);
    update_option('show_on_front', 'page');

    app_log("\t->Adding auth page on {$site_name}");
    $auth_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Auth'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'auth',
        'page_template' => 'auth-template.php',
        'post_content' => '<!-- wp:app/auth {"name":"app/auth","data":array(),"mode":"edit"} /-->'
    ));
    update_option('authentication_page_id', $auth_page_id);

    app_log("\t->Adding dashboard page on {$site_name}");
    $dashboard_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Dashboard'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'dashboard',
        'post_content' => '<!-- wp:app/dashboard {"name":"app/dashboard","data":array(),"mode":"edit"} /-->'
    ));
    update_option('dashboard_page_id', $dashboard_page_id);

    app_log("\t->Adding apps page on {$site_name}");
    $apps_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Apps'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'apps',
        'post_content' => '<!-- wp:app/apps {"name":"app/apps","data":array(),"mode":"edit"} /-->'
    ));
    update_option('apps_page_id', $apps_page_id);

    app_log("\t->Adding users page on {$site_name}");
    $users_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Users'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'users',
        'post_content' => '<!-- wp:app/users {"name":"app/users","data":array(),"mode":"edit"} /-->'
    ));
    update_option('users_page_id', $users_page_id);

    app_log("\t->Adding settings page on {$site_name}");
    $settings_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Settings'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'settings',
        'post_content' => '<!-- wp:app/settings {"name":"app/settings","data":array(),"mode":"edit"} /-->'
    ));
    update_option('settings_page_id', $settings_page_id);

    app_log("\t->Adding activity page on {$site_name}");
    $activity_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Activity'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'activity',
        'post_content' => '<!-- wp:app/activity {"name":"app/activity","data":array(),"mode":"edit"} /-->'
    ));
    update_option('activity_page_id', $activity_page_id);

    app_log("\t->Adding support page on {$site_name}");
    $support_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Support'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'support',
        'post_content' => '<!-- wp:app/support {"name":"app/support","data":array(),"mode":"edit"} /-->'
    ));
    update_option('support_page_id', $support_page_id);

    app_log("\t->Syncing admin password on {$site_name}");
    $user_id = 1;
    $user = get_user($user_id);
    $email = $user->user_email;
    $file_name = base64_encode($email).'.txt';
    $file_path = MC_USERS_PATH."/$file_name";
    global $wpdb;
    if (is_file($file_path)) {
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

    app_log("\t->Updating wp options on {$site_name}");
    app_log(update_option('timezone_string', 'Europe/Madrid'));
    app_log(update_option('permalink_structure', '/%postname%/'));
    app_log(update_option('WPLANG', 'es_ES'));

    $wpdb->update(
        $wpdb->options,
        array('option_value' => '/%postname%/'),
        array('option_name' => 'permalink_structure')
    );

    update_post_meta($dashboard_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67v-586.66q0-27 19.83-46.84Q159.67-840 186.67-840h586.66q27 0 46.84 19.83Q840-800.33 840-773.33v586.66q0 27-19.83 46.84Q800.33-120 773.33-120H186.67Zm0-66.67h260v-586.66h-260v586.66Zm326.66 0h260v-294h-260v294Zm0-360.66h260v-226h-260v226Z"/></svg>');
    update_post_meta($apps_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M120-510v-330h330v330H120Zm0 390v-330h330v330H120Zm390-390v-330h330v330H510Zm0 390v-330h330v330H510ZM180-570h210v-210H180v210Zm390 0h210v-210H570v210Zm0 390h210v-210H570v210Zm-390 0h210v-210H180v210Zm390-390Zm0 180Zm-180 0Zm0-180Z"/></svg>');
    update_post_meta($users_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M38.67-160v-100q0-34.67 17.83-63.17T105.33-366q69.34-31.67 129.67-46.17 60.33-14.5 123.67-14.5 63.33 0 123.33 14.5T611.33-366q31 14.33 49.17 42.83T678.67-260v100h-640Zm706.66 0v-102.67q0-56.66-29.5-97.16t-79.16-66.84q63 7.34 118.66 22.5 55.67 15.17 94 35.5 34 19.34 53 46.17 19 26.83 19 59.83V-160h-176ZM358.67-480.67q-66 0-109.67-43.66Q205.33-568 205.33-634T249-743.67q43.67-43.66 109.67-43.66t109.66 43.66Q512-700 512-634t-43.67 109.67q-43.66 43.66-109.66 43.66ZM732-634q0 66-43.67 109.67-43.66 43.66-109.66 43.66-11 0-25.67-1.83-14.67-1.83-25.67-5.5 25-27.33 38.17-64.67Q578.67-590 578.67-634t-13.17-80q-13.17-36-38.17-66 12-3.67 25.67-5.5 13.67-1.83 25.67-1.83 66 0 109.66 43.66Q732-700 732-634ZM105.33-226.67H612V-260q0-14.33-8.17-27.33-8.16-13-20.5-18.67-66-30.33-117-42.17-51-11.83-107.66-11.83-56.67 0-108 11.83-51.34 11.84-117.34 42.17-12.33 5.67-20.16 18.67-7.84 13-7.84 27.33v33.33Zm253.34-320.66q37 0 61.83-24.84Q445.33-597 445.33-634t-24.83-61.83q-24.83-24.84-61.83-24.84t-61.84 24.84Q272-671 272-634t24.83 61.83q24.84 24.84 61.84 24.84Zm0 320.66Zm0-407.33Z"/></svg>');
    update_post_meta($settings_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="m382-80-18.67-126.67q-17-6.33-34.83-16.66-17.83-10.34-32.17-21.67L178-192.33 79.33-365l106.34-78.67q-1.67-8.33-2-18.16-.34-9.84-.34-18.17 0-8.33.34-18.17.33-9.83 2-18.16L79.33-595 178-767.67 296.33-715q14.34-11.33 32.34-21.67 18-10.33 34.66-16L382-880h196l18.67 126.67q17 6.33 35.16 16.33 18.17 10 31.84 22L782-767.67 880.67-595l-106.34 77.33q1.67 9 2 18.84.34 9.83.34 18.83 0 9-.34 18.5Q776-452 774-443l106.33 78-98.66 172.67-118-52.67q-14.34 11.33-32 22-17.67 10.67-35 16.33L578-80H382Zm55.33-66.67h85l14-110q32.34-8 60.84-24.5T649-321l103.67 44.33 39.66-70.66L701-415q4.33-16 6.67-32.17Q710-463.33 710-480q0-16.67-2-32.83-2-16.17-7-32.17l91.33-67.67-39.66-70.66L649-638.67q-22.67-25-50.83-41.83-28.17-16.83-61.84-22.83l-13.66-110h-85l-14 110q-33 7.33-61.5 23.83T311-639l-103.67-44.33-39.66 70.66L259-545.33Q254.67-529 252.33-513 250-497 250-480q0 16.67 2.33 32.67 2.34 16 6.67 32.33l-91.33 67.67 39.66 70.66L311-321.33q23.33 23.66 51.83 40.16 28.5 16.5 60.84 24.5l13.66 110Zm43.34-200q55.33 0 94.33-39T614-480q0-55.33-39-94.33t-94.33-39q-55.67 0-94.5 39-38.84 39-38.84 94.33t38.84 94.33q38.83 39 94.5 39ZM480-480Z"/></svg>');
    update_post_meta($activity_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M80-685.33v-128q0-27 19.83-46.84Q119.67-880 146.67-880h128v66.67h-128v128H80ZM274.67-80h-128q-27 0-46.84-19.83Q80-119.67 80-146.67v-128h66.67v128h128V-80Zm410.66 0v-66.67h128v-128H880v128q0 27-19.83 46.84Q840.33-80 813.33-80h-128Zm128-605.33v-128h-128V-880h128q27 0 46.84 19.83Q880-840.33 880-813.33v128h-66.67Zm-273.28 96q-31.05 0-53.22-22.12-22.16-22.11-22.16-53.16 0-31.06 22.11-53.22Q508.89-740 539.95-740q31.05 0 53.22 22.11 22.16 22.12 22.16 53.17t-22.11 53.22q-22.11 22.17-53.17 22.17ZM504-236.67H355.33l44-224.66-90.66 40.66V-286H242v-179.33L404-534q33-14.33 47.5-18.17Q466-556 479.73-556q20.6 0 36.94 9.33Q533-537.33 544-520l41.33 66q26 42 70.84 71.67Q701-352.67 760-352.67V-286q-66.67 0-120.83-29.83Q585-345.67 542-402l-38 165.33Z"/></svg>');
    update_post_meta($support_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-119.33-87.33 58-136.67q-39.34-13.67-69.17-43.17T304-418l-136.67 55.33q28.34 68.67 78.34 119.34 50 50.66 115 76Zm-57.34-374q16.34-41.34 45.84-71.17 29.5-29.83 68.83-43.5l-55.33-136.67Q291.33-764 240.67-713 190-662 167.33-596.67l136 55.34ZM480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm119.33 192.67q67-26.67 116.84-76.84 49.83-50.16 76.5-116.5L656-418q-15 42-45 71.17-30 29.16-69 42.83l57.33 136.67ZM656-542.67l136.67-56.66q-26.67-66.34-76.84-116.5-50.16-50.17-116.5-76.84l-56 137.34q39 13.66 67.67 42.83 28.67 29.17 45 69.83Z"/></svg>');

    $main_cta = array(
        'route' => "/apps/market",
        'title' => __('Add your first app', APP_THEME_LOCALE),
    );
    update_option('main_cta', $main_cta);

    $account_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Account'), APP_THEME_LOCALE,
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'account',
        'post_content' => '<!-- wp:app/account {"name":"app/account","data":array(),"mode":"edit"} /-->'
    ));

    update_option('account_page_id', $account_page_id);
    update_post_meta($account_page_id, 'icon', '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#005f6b"><path d="M480-480.67q-66 0-109.67-43.66Q326.67-568 326.67-634t43.66-109.67Q414-787.33 480-787.33t109.67 43.66Q633.33-700 633.33-634t-43.66 109.67Q546-480.67 480-480.67ZM160-160v-100q0-36.67 18.5-64.17T226.67-366q65.33-30.33 127.66-45.5 62.34-15.17 125.67-15.17t125.33 15.5q62 15.5 127.28 45.3 30.54 14.42 48.96 41.81Q800-296.67 800-260v100H160Zm66.67-66.67h506.66V-260q0-14.33-8.16-27-8.17-12.67-20.5-19-60.67-29.67-114.34-41.83Q536.67-360 480-360t-111 12.17Q314.67-335.67 254.67-306q-12.34 6.33-20.17 19-7.83 12.67-7.83 27v33.33ZM480-547.33q37 0 61.83-24.84Q566.67-597 566.67-634t-24.84-61.83Q517-720.67 480-720.67t-61.83 24.84Q393.33-671 393.33-634t24.84 61.83Q443-547.33 480-547.33Zm0-86.67Zm0 407.33Z"/></svg>');

    $account_permalink = get_permalink($account_page_id);

    $pages_slugs = array(
        $dashboard_page_id => array(
            '/apps/market' => __('Add your , APP_THEME_LOCALEfirst app'),
        ),
        $apps_page_id => array(
            'all' => __('All apps', APP_THEME_LOCALE),
            'installed' => __('Installed'), APP_THEME_LOCALE,
            'market' => __('Market'), APP_THEME_LOCALE,
        ),
        $users_page_id => array(
            'all' => __('All users', APP_THEME_LOCALE),
            'add' => __('Add user', APP_THEME_LOCALE),
            $account_permalink => __('My account', APP_THEME_LOCALE),
        ),
        $account_page_id => array(
            '/account/' => __('Account', APP_THEME_LOCALE),
            '/account/settings' => __('Settings', APP_THEME_LOCALE),
            '/account/security' => __('Security', APP_THEME_LOCALE),
        ),
        $settings_page_id => array(
            'company-info' => __('Company info', APP_THEME_LOCALE),
        ),
        $activity_page_id => array(
            'all' => __('All activity', APP_THEME_LOCALE)
        )
    );

    $invoice_page_id = wp_insert_post(array(
        'post_type' => 'page',
        'post_title' => __('Invoices'),
        'post_status' => 'publish',
        'post_author' => 1,
        'post_name' => 'invoices',
        'post_content' => '<!-- wp:app/invoice {"name":"app/invoice","data":array(),"mode":"edit"} /-->'
    ));
    update_option('invoice_page_id', $invoice_page_id);

    foreach ($pages_slugs as $page_id => $routes) {
        update_post_meta($page_id, 'routes', $routes);
    }

    app_log("\t->Flushing rewrite rules on {$site_name}");
    flush_rewrite_rules();
    app_log("\t->Settings installation status on {$site_name}");
};
