<?php

namespace App;

class App
{
    public static function start() : void {
        self::loader(SRC_PATH . '/app/setup/*.php', 'App\\Setup\\');
        self::loader(SRC_PATH . '/app/controllers/*.php', 'App\\Controllers\\');
    }

    public static function loader(string $path, string $namespace = 'App\\') : void {
        foreach(glob($path) as $config_file) {
            $class_name = $namespace;
            $class_name .= basename($config_file, '.php');
            if(method_exists($class_name, 'init')) {
                $class_name::init();
            }
        }
    }
}