<?php
namespace App;
use App\classes\blocks\Icon_Grid;
use App\classes\post_types\Team_Members;
use App\config\Theme_Options;
use App\config\Theme_Setup;
use App\config\Timber_Setup;
use App\classes\Blocks;
use App\classes\Security;
use App\classes\Gutenberg;

define('APP_THEME_LOCALE', 'app');
define('APP_THEME_URL', get_stylesheet_directory_uri());
define('APP_THEME_DIR', __DIR__);

Theme_Setup::init();
Theme_Options::init();
Timber_Setup::init();
Gutenberg::init();
Security::init();
Blocks::init();

$helpers = glob(APP_SRC . '/helpers/*.php');
if($helpers) {
    foreach($helpers as $helper) {
        if(is_file($helper)) require_once $helper;
    }
}