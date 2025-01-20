<?php

namespace App\Hooks\Account;

class Block {
    public static function app_before_render_block(array $context) : array {
        $context['routes'] = array(
            'basic' => __('Basic info', APP_THEME_LOCALE),
            'profile' => __('Profile info', APP_THEME_LOCALE),
            'settings' => __('Account settings', APP_THEME_LOCALE),
            'preferences' => __('Preferences', APP_THEME_LOCALE),
            'extend' => __('Extend', APP_THEME_LOCALE),
            'security' => __('Security', APP_THEME_LOCALE),
        );

        return $context;
    }
}