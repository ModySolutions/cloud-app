<?php

namespace App\Setup;

use Roots\WPConfig\Config;
use Timber\Timber;
use function Env\env;

class Mail {
    public static function init(): void {
//        add_action('phpmailer_init', self::phpmailer_init(...), 100);
        add_filter('wp_mail', self::wp_mail(...));
//        add_filter( 'wp_mail_content_type', self::wp_mail_content_type(...));
//        add_filter( 'wp_mail_from_name', self::wp_mail_from_name(...));
    }

    public static function phpmailer_init($phpmailer): void {
        $phpmailer->isSMTP();
        $phpmailer->Host = Config::get('SMTP_HOST');
        $phpmailer->SMTPAuth = Config::get('SMTP_AUTH');
        $phpmailer->SMTPSecure = Config::get('SMTP_SECURE');
        $phpmailer->Port = Config::get('SMTP_PORT');
        $phpmailer->Username = Config::get('SMTP_USERNAME');
        $phpmailer->Password = Config::get('SMTP_PASSWORD');
    }

    public static function wp_mail(array $args): bool {
        $context = Timber::context([
            'site_url' => home_url(),
            'year' => gmdate('Y'),
            'lang' => get_language_attributes('html'),
            'message' => $args['message'],
        ]);
        $context['logo'] = Timber::compile('@app/common/logos/email-logo.twig', $context + ['link' => home_url()]);
        $args['message'] = Timber::compile('@app/mail/template.twig', $context);

        $to = $args['to'];
        $subject = $args['subject'];
        $message = $args['message'];
        $headers = $args['headers'] ?? [];

        return self::sendgrid_send_mail($to, $subject, $message, $headers);
    }

    public static function wp_mail_content_type() : string {
        return 'text/html';
    }

    public static function wp_mail_from_name() : string {
        return env('APP_COMPANY');
    }

    public static function sendgrid_send_mail($to, $subject, $message, $headers = []) : bool {
        $url = Config::get('SENDGRID_API_URL');

        $email_data = [
            'personalizations' => [[
                'to' => is_array($to) ? array_map(fn($email) => ['email' => $email], $to) : [['email' => $to]],
                'subject' => $subject
            ]],
            'from' => [
                'email' => Config::get('EMAIL_FROM'),
                'name'  => Config::get('EMAIL_FROM_NAME')
            ],
            'content' => [[
                'type' => 'text/html',
                'value' => nl2br($message)
            ]]
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($email_data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . Config::get('SENDGRID_API_KEY'),
            'Content-Type: application/json'
        ]);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return ($http_code >= 200 && $http_code < 300);
    }
}