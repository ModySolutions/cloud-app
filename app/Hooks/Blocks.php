<?php

namespace App\Hooks;

use Timber\Timber;

class Blocks
{
    public static function init(): void
    {
        add_action('init', self::register_block_types(...));
    }

    public static function register_block_types(): void
    {
        $block_types_v2 = glob(APP_THEME_DIR . '/blocks/*');
        if (count($block_types_v2) > 0) {
            foreach ($block_types_v2 as $block) {
                if (is_dir($block)) {
                    register_block_type($block);
                }
            }
        }
    }

    public static function render($block, $content = '', $is_preview = false): void
    {
        $block_name = sanitize_title_with_dashes(str_replace('app/', '', $block['name']));
        $block_template = $block_name . '.twig';

        $context = Timber::context([
            'block' => $block,
            'fields' => get_fields(),
            'is_preview' => $is_preview,
        ]);

        $context = apply_filters('app_before_render_block', $context);
        $context = apply_filters("app_before_render_block_{$block_name}", $context);
        Timber::render('@app/blocks/' . $block_template, $context);
    }
}
