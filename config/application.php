<?php

/**
 * Your base production configuration goes in this file. Environment-specific
 * overrides go in their respective config/environments/{{WP_ENV}}.php file.
 *
 * A good default policy is to deviate from the production config as little as
 * possible. Try to define as much of your configuration in this file as you
 * can.
 */

use Roots\WPConfig\Config;

use function Env\env;

// USE_ENV_ARRAY + CONVERT_* + STRIP_QUOTES
Env\Env::$options = 31;

/**
 * Directory containing all of the site's files
 *
 * @var string
 */
$root_dir = dirname(__DIR__);

/**
 * Document Root
 *
 * @var string
 */
$webroot_dir = $root_dir . '/web';

/**
 * Use Dotenv to set required environment variables and load .env file in root
 * .env.local will override .env if it exists
 */
if (file_exists($root_dir . '/.env')) {
    if (!function_exists('app_get_subdomain')) {
        function app_get_subdomain(): string
        {
            $host = parse_url($_SERVER['HTTP_HOST'], PHP_URL_HOST) ?? $_SERVER['HTTP_HOST'];
            $parts = explode('.', $host);

            if (count($parts) > 2) {
                array_pop($parts);
                array_pop($parts);
            }
            return implode('.', $parts);
        }
    }

    $env_files = file_exists($root_dir . '/.env.local')
        ? ['.env', '.env.local']
        : ['.env'];

    $paths = [$root_dir];

    $sub_domain = php_sapi_name() !== 'cli' ? app_get_subdomain() : false;
    if ($sub_domain && file_exists("{$root_dir}/config/sites/{$sub_domain}/.env")) {
        $paths[] = "{$root_dir}/config/sites/{$sub_domain}";
    }

    $repository = Dotenv\Repository\RepositoryBuilder::createWithNoAdapters()
        ->addAdapter(Dotenv\Repository\Adapter\EnvConstAdapter::class)
        ->addAdapter(Dotenv\Repository\Adapter\PutenvAdapter::class)
        ->immutable()
        ->make();

    $dotenv = Dotenv\Dotenv::create($repository, $paths, $env_files, false);
    $dotenv->load();

    $dotenv->required(['WP_HOME', 'WP_SITEURL']);
    if (!env('DATABASE_URL')) {
        $dotenv->required(['DB_NAME', 'DB_USER', 'DB_PASSWORD']);
    }
}

/**
 * Set up our global environment constant and load its config first
 * Default: production
 */
define('WP_ENV', env('WP_ENV') ?: 'production');

/**
 * Infer WP_ENVIRONMENT_TYPE based on WP_ENV
 */
if (!env('WP_ENVIRONMENT_TYPE') && in_array(WP_ENV, ['production', 'staging', 'development', 'local'])) {
    Config::define('WP_ENVIRONMENT_TYPE', WP_ENV);
}

/**
 * URLs
 */
Config::define('WP_HOME', env('WP_HOME'));
Config::define('WP_SITEURL', env('WP_SITEURL'));

/**
 * Custom Content Directory
 */
Config::define('CONTENT_DIR', '/content');
Config::define('WP_CONTENT_DIR', $webroot_dir . Config::get('CONTENT_DIR'));
Config::define('WP_CONTENT_URL', Config::get('WP_HOME') . Config::get('CONTENT_DIR'));

/**
 * DB settings
 */
if (env('DB_SSL')) {
    Config::define('MYSQL_CLIENT_FLAGS', MYSQLI_CLIENT_SSL);
}

Config::define('DB_NAME', env('DB_NAME'));
Config::define('DB_USER', env('DB_USER'));
Config::define('DB_PASSWORD', env('DB_PASSWORD'));
Config::define('DB_HOST', env('DB_HOST') ?: 'localhost');
Config::define('DB_CHARSET', 'utf8mb4');
Config::define('DB_COLLATE', '');
$table_prefix = env('DB_PREFIX') ?: 'wp_';

if (env('DATABASE_URL')) {
    $dsn = (object) parse_url(env('DATABASE_URL'));

    Config::define('DB_NAME', substr($dsn->path, 1));
    Config::define('DB_USER', $dsn->user);
    Config::define('DB_PASSWORD', isset($dsn->pass) ? $dsn->pass : null);
    Config::define('DB_HOST', isset($dsn->port) ? "{$dsn->host}:{$dsn->port}" : $dsn->host);
}

/**
 * Authentication Unique Keys and Salts
 */
Config::define('AUTH_KEY', env('AUTH_KEY'));
Config::define('SECURE_AUTH_KEY', env('SECURE_AUTH_KEY'));
Config::define('LOGGED_IN_KEY', env('LOGGED_IN_KEY'));
Config::define('NONCE_KEY', env('NONCE_KEY'));
Config::define('AUTH_SALT', env('AUTH_SALT'));
Config::define('SECURE_AUTH_SALT', env('SECURE_AUTH_SALT'));
Config::define('LOGGED_IN_SALT', env('LOGGED_IN_SALT'));
Config::define('NONCE_SALT', env('NONCE_SALT'));

/**
 * Custom Settings
 */
Config::define('AUTOMATIC_UPDATER_DISABLED', true);
Config::define('DISABLE_WP_CRON', env('DISABLE_WP_CRON') ?: false);

// Disable the plugin and theme file editor in the admin
Config::define('DISALLOW_FILE_EDIT', true);

// Disable plugin and theme updates and installation from the admin
Config::define('DISALLOW_FILE_MODS', true);

// Limit the number of post revisions
Config::define('WP_POST_REVISIONS', env('WP_POST_REVISIONS') ?? true);

// Disable script concatenation
Config::define('CONCATENATE_SCRIPTS', false);

// Email
Config::define('SENDGRID_API_KEY', env('SENDGRID_API_KEY'));
Config::define('SENDGRID_API_URL', env('SENDGRID_API_URL'));
Config::define('EMAIL_FROM', env('EMAIL_FROM'));
Config::define('EMAIL_FROM_NAME', env('EMAIL_FROM_NAME'));

/**
 * Debugging Settings
 */
Config::define('WP_DEBUG_DISPLAY', env('WP_DEBUG_DISPLAY') ?? false);
Config::define('WP_DEBUG_LOG', env('WP_DEBUG_LOG') ?? false);
Config::define('SCRIPT_DEBUG', env('SCRIPT_DEBUG') ?? false);
ini_set('display_errors', env('PHP_DISPLAY_ERRORS') ?? '0');

/**
 * Multisite
 */
Config::define('WP_ALLOW_MULTISITE', false);

/**
 * Mody CLoud
 */
Config::define('APP_MAIN_SITE', env('APP_MAIN_SITE') ?? '');
Config::define('APP_COMPANY', env('APP_COMPANY') ?? false);
Config::define('APP_DOMAIN', env('APP_DOMAIN') ?? false);
Config::define('APP_PROTOCOL', env('APP_PROTOCOL') ?? 'http://');
Config::define('APP_PATH', $root_dir . '/app');
Config::define('APP_THEME_DOMAIN', 'app');
Config::define('APP_MAIN_API_USER', env('APP_MAIN_API_USER'));
Config::define('APP_MAIN_API_KEY', env('APP_MAIN_API_KEY'));

Config::define('ROOT_DIR', $webroot_dir);
Config::define('SRC_PATH', $root_dir . '/resources');
define('SRC_PATH', $root_dir . '/resources');
Config::define('LOGS_PATH', $root_dir . '/logs');

Config::define('MC_SITES_PATH', __DIR__ . '/sites');
Config::define('MC_USERS_PATH', __DIR__ . '/users');
Config::define('MC_AUTOLOGIN_TOKENS_PATH', __DIR__ . '/autologin-tokens');
Config::define('MC_LOGOUT_PATH', __DIR__ . '/logout-info');
Config::define('MC_UUID_PATH', __DIR__ . '/uuid');
Config::define('MC_MIGRATIONS_PATH', $root_dir . '/app/migrations');
Config::define('MC_PLUGINS_PATH', $webroot_dir . '/content/plugins');
Config::define('MC_APP_PASSWD_NAME', 'app.passwd.mody.cloud');

Config::define('DEFAULT_DB_HOST', '127.0.0.1');
Config::define('CHILD_SITE', env('CHILD_SITE') ?? false);
Config::define('ADMIN_EMAIL', env('ADMIN_EMAIL') ?? false);
Config::define('SPACE_PATH', env('SPACE_PATH') ?? false);

Config::define('WP_DEFAULT_THEME', 'cloud');
Config::define('WP_HTTP_BLOCK_EXTERNAL', false);

Config::define('SPACE_NAME', env('SPACE_NAME') ?? null);
Config::define('APP_CHILD_SITES_TOKEN', env('APP_CHILD_SITES_TOKEN') ?? null);

Config::define('RECAPTCHA_KEY', env('RECAPTCHA_KEY') ?? null);
Config::define('RECAPTCHA_SECRET', env('RECAPTCHA_SECRET') ?? null);
/**
 * Allow WordPress to detect HTTPS when used behind a reverse proxy or a load balancer
 * See https://codex.wordpress.org/Function_Reference/is_ssl#Notes
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

$env_config = __DIR__ . '/environments/' . WP_ENV . '.php';

if (file_exists($env_config)) {
    require_once $env_config;
}

Config::apply();

/**
 * Bootstrap WordPress
 */
if (!defined('ABSPATH')) {
    define('ABSPATH', $webroot_dir . '/wp/');
}

if (!defined('COOKIE_DOMAIN')) {
    define('COOKIE_DOMAIN', env('COOKIE_DOMAIN') ?? null);
}
