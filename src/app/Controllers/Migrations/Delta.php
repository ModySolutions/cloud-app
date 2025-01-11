<?php

namespace App\Controllers\Migrations;

class Delta {
    public static function create_table() : void {
        if(get_option('migration_table_created')) return;
        global $wpdb;

        $table_name = $wpdb->prefix . 'migrations';
        $charset_collate = $wpdb->get_charset_collate();

        $sql = <<<EOF
CREATE TABLE IF NOT EXISTS $table_name (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    migration_name VARCHAR(255) NOT NULL,
    applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) $charset_collate;
EOF;
;

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        update_option('migration_table_created', 'created');
    }
}