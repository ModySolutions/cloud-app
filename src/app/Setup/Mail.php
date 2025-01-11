<?php

namespace App\Setup;

use Roots\WPConfig\Config;
use Timber\Timber;
use function Env\env;

class Mail {
    public static function init(): void {
        add_action('phpmailer_init', self::phpmailer_init(...), 100);
        add_filter('wp_mail', self::wp_mail(...));
        add_filter( 'wp_mail_content_type', self::wp_mail_content_type(...));
        add_filter( 'wp_mail_from_name', self::wp_mail_from_name(...));
    }

    public static function phpmailer_init($phpmailer): void {
        $phpmailer->isSMTP();
        $phpmailer->Host = Config::get('SMTP_HOST');
        $phpmailer->SMTPAuth = Config::get('SMTP_AUTH');
        $phpmailer->Port = Config::get('SMTP_PORT');
        $phpmailer->Username = Config::get('SMTP_USERNAME');
        $phpmailer->Password = Config::get('SMTP_PASSWORD');
    }

    public static function wp_mail(array $args): array {
        $context = Timber::context([
            'site_url' => home_url(),
            'year' => gmdate('Y'),
            'lang' => get_language_attributes('html'),
            'message' => $args['message'],
        ]);
        $context['logo'] = Timber::compile('@app/common/logos/email-logo.twig', $context + ['link' => home_url()]);
        $args['message'] = Timber::compile('@app/mail/template.twig', $context);
        return $args;
    }

    public static function wp_mail_content_type() : string {
        return 'text/html';
    }

    public static function wp_mail_from_name() : string {
        return env('APP_COMPANY');
    }
}