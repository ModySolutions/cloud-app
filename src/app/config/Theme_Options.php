<?php

namespace App\config;

class Theme_Options {
	public static function init(): void {
		Theme_Options::action();
	}

	public static function action(): void {
		add_action( 'acf/init', self::acf_init( ... ) );
	}

	public static function acf_init() {
		if ( function_exists( 'acf_add_options_page' ) ) {
			acf_add_options_page( [
				'page_title' => __( 'Theme Options' ),
				'menu_title' => __( 'Theme Options' ),
				'menu_slug'  => 'theme-options',
				'capability' => 'edit_posts',
				'redirect'   => false,
			] );
		}
	}
}