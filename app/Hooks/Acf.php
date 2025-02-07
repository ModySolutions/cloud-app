<?php

namespace App\Hooks;

class Acf {
    public static function init() : void {
        add_filter('acf/prepare_field/name=queue_info', self::acf_prepare_field(...));
        add_filter('acf/prepare_field/name=queue_type', self::acf_prepare_field(...));
    }

    public static function acf_prepare_field(array $field) : array {
        $field['readonly'] = true;
        $field['disabled'] = $field['_name'] === 'queue_type';
        return $field;
    }
}