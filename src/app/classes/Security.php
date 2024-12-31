<?php

namespace App\classes;

class Security {
	public static function init() : void {
		self::action();
	}

	public static function action() : void {
		remove_action('wp_head', 'rest_output_link_wp_head', 10);
		remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
		remove_action('template_redirect', 'rest_output_link_header', 10);
	}
}
