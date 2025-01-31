<?php

namespace App\Hooks\Plugin;

class Admin {
    public static function admin_init() : void {
        self::activate_invoice_app();
    }

    public static function activate_invoice_app() : void {
        if(!defined('APP_INVOICE_DIR')) {
            $plugin = MC_PLUGINS_PATH . '/invoice/invoice.php';
            if ( !is_plugin_active( $plugin ) ) {
                activate_plugin( $plugin );
            }
        }
    }
}