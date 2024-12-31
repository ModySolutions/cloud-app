<?php

namespace App\config;

use Timber\Timber;

class Timber_Setup {
	static function init(): void {
		Timber_Setup::action();
	}

	static function action(): void {
		if ( \Timber::class ) {
			add_action( 'timber/context', self::timber_context( ... ) );
			add_filter( 'timber/twig', self::timber_twig(...) );
		} else {
			add_action( 'admin_notices', self::admin_notice( ... ) );
		}
		add_action('after_switch_theme', self::after_switch_theme(...));
	}

	public static function admin_notice(): void {
		echo <<<EOF
<div class="error">
  <p>
    Timber not activated. Please run <pre>composer require timber/timber</pre> in the project root terminal.
  </p>
</div>
EOF;
	}

	public static function timber_context( array $context ) : array {
		if (function_exists('get_fields')) {
			$context['options'] = get_fields('options');
		}
		$context['header_menu'] = Timber::get_menu('header_menu');
		$context['header_cta_link'] = '#';
		$context['header_cta_text'] = __('Contact us', APP_THEME_LOCALE);
		$context['header_cta_link_two'] = '#';
		$context['header_cta_text_two'] = __('Support login', APP_THEME_LOCALE);
		$context['footer_top_menu'] = Timber::get_menu('footer_top_menu');
		$context['footer_bottom_menu'] = Timber::get_menu('footer_bottom_menu');
		return $context;
	}

	public static function timber_twig( \Twig\Environment $twig ) : \Twig\Environment {
		$twig->addFilter(new \Twig\TwigFilter( 'admin_url', function( $filename ) {
			return admin_url( $filename );
		} ) );

		$twig->addFilter(new \Twig\TwigFilter( 'print_id', function( $string ) {
			$id = " id=\"{$string}\" ";
			return $string ? $id : '';
		} ) );

		return $twig;
	}

	public static function after_switch_theme() : void {
		if (get_option('scaffold_defaultPosts')) {
			return;
		}
		wp_delete_post( 1, true );// Sample Post
		wp_delete_post( 2, true );// Sample Page
		wp_delete_post( 3, true );// Privacy Policy Page
		wp_delete_comment( 1, true );// Sample Comment

		// Create home page
		$home_page = array(
			'post_type' => 'page',
			'post_title' => 'Home',
			'post_status' => 'publish',
			'post_author' => 1,
			'post_name' => '',
			'page_template' => 'home.php'
		);
		$post_id = wp_insert_post($home_page);
		update_option('page_on_front', $post_id);
		update_option('show_on_front', 'page');
		update_post_meta($post_id, '_yoast_wpseo_metadesc', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.');

		add_option('scaffold_defaultPosts','removed');
	}
}