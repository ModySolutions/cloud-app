<?php

namespace App\classes\blocks;

class Slider
{
    public static function init() : void {
        add_filter('app_before_render_block', self::app_before_render_block(...));
    }

    public static function app_before_render_block(array $context) : array {
        if($context['block']['name'] !== 'acf/slider') return $context;
        $fields =& $context['fields'];
        switch($fields['type']) {
            case 'testimonial':
                $fields['pages'] = $fields['items'];
                break;
            case 'google-reviews':
                $fields['pages'] = ceil($fields['items'] / 4);
                break;
        }
        return $context;
    }
}