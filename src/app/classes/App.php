<?php

namespace App\classes;

use App\config\Theme_Setup;
use App\config\Timber_Setup;
use App\classes\Blocks;
use App\classes\Security;
use App\classes\Gutenberg;

class App
{
    public static function start() : void {
        Theme_Setup::init();
        Timber_Setup::init();
        Auth::init();
        Mail::init();
        Gutenberg::init();
        Security::init();
        Blocks::init();
    }
}