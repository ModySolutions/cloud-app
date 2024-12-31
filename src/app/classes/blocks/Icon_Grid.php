<?php

namespace App\classes\blocks;

class Icon_Grid
{
    public static function init() : void {
        add_filter('app_before_render_block', self::app_before_render_block(...));
    }

    public static function app_before_render_block(array $context) : array {
        if($context['block']['name'] !== 'acf/icon-grid') return $context;
        $items =& $context['fields']['items'];
        $sizes = [
            'small' => '1.5625rem',
            'medium' => '5.3125rem',
            'large' => '10rem'
        ];
        foreach($items as &$item) {
            $item['size'] = $sizes[$item['image_size']];
        }
        return $context;
    }
}