<?php

namespace App\controllers\setup_wizard;

class Block {
    public static function app_before_render_block(array $context) : array {
        return $context;
    }
}