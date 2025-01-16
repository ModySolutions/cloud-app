<?php

namespace App\Hooks;

use App\Hooks\Plugin\Admin;

class PluginHooks {
    public static function init() : void {
        add_action('admin_init', Admin::admin_init(...));
    }
}