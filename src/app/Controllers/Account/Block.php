<?php

namespace App\Controllers\Account;

class Block {
    public static function app_before_render_block(array $context) : array {
        $context['routes'] = array(
            'basic' => __('Basic info'),
            'profile' => __('Profile info'),
            'settings' => __('Account settings'),
            'preferences' => __('Preferences'),
            'extend' => __('Extend'),
            'security' => __('Security'),
        );

        return $context;
    }
}