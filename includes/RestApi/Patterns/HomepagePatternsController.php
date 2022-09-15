<?php

namespace NewfoldLabs\WP\Module\Onboarding\RestApi\Patterns;

use NewfoldLabs\WP\Module\Onboarding\Permissions;

/**
 * Class HomepagePatternsController
 */
class HomepagePatternsController extends \WP_REST_Controller {

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 */
	protected $namespace = 'newfold-onboarding/v1';

	/**
	 * The base of this controller's route.
	 *
	 * @var string
	 */
	protected $rest_base = 'patterns';

	/**
	  * The block namespace slugs for different themes
	  *
	  * @var array
	  */
	 protected $block_namespace_slugs = array (
		'yith-wonder'
	 );

	/**
	 * The approved list of homepage patterns
	 *
	 * @var array
	 */
	protected $homepage_pattern_slugs = array(
		'yith-wonder'  => array(
			// 'header'   => array(
			// 	'site-header-left-logo-navigation-inline',
			// 	'site-header-centered',	
			// 	'site-header-left-logo-navigation-below'	
			// ),
			'homepage' => array(
				'homepage-1',
				'homepage-2',
				'homepage-3',
			)
		)	
	);

	 /**
	  * This will allow us to query block patterns.
	  *
	  * @var \WP_Block_Patterns_Registry
	  */
	 protected $patterns_registry_instance;

	public function __construct() {
		 $this->patterns_registry_instance = \WP_Block_Patterns_Registry::get_instance();
	}

	/**
	 * Registers REST routes for this controller class.
	 */
	public function register_routes() {

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/homepage',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_homepage_patterns' ),
					'permission_callback' => array( Permissions::class, 'rest_is_authorized_admin' ),
				),
			)
		);

	}

	/**
	 * Cleans the content for the homepages
	 *
	 * @return string
	 */
	public function cleanup_wp_grammar( $content ) {

		// Remove template-part if that exists
		$content = preg_replace('/^<!-- wp:template-part .* \/-->$/m', '', $content);

		// Create an array with the values you want to replace
		$searches = array("\n", "\t");

		// Replace the line breaks and tabs with a empty string
		$content = str_replace($searches, "", $content);

		return $content;
	}

	/**
	 * Retrieves the patterns approved by the Onboarding Module.
	 *
	 * @return array|\WP_Error
	 */
	public function get_patterns($block_namespace, $block_pattern) {
		
		$pattern_name = $block_namespace . '/' . $block_pattern;
		if ( $this->patterns_registry_instance->is_registered( $pattern_name ) ) {
			$pattern = $this->patterns_registry_instance->get_registered( $pattern_name );

			return 
				array(
					'name'    => $pattern['name'],
					'title'   => $pattern['title'],
					'content' => $this->cleanup_wp_grammar($pattern['content'])
				);
		}
		else
			return new \WP_Error(
				'Pattern Instance is not registered',
				'The Pattern Instance not registered for Pattern: ' . $block_pattern,
				array( 'status' => 404 )
			);
	}

	/**
	 * Add Header to HomePages
	 *
	 * @return array
	 */
	public function add_header_patterns( $block_namespace, $block_pattern_files ) {

		// If there doesn't exist Header slugs
		if(!isset($this->homepage_pattern_slugs[$block_namespace]['header'])){
			return $block_pattern_files;
		}
		
		// If there doesn't exist a Header for every single Homepage
		if(count($this->homepage_pattern_slugs[$block_namespace]['header']) 
			!= count($this->homepage_pattern_slugs[$block_namespace]['homepage'])){
			return $block_pattern_files;
		}

		for ( $i=0; $i<count($block_pattern_files); $i++ ) {

			if (isset( $this->homepage_pattern_slugs[$block_namespace]['header'][$i])) {
				$block_pattern = $this->homepage_pattern_slugs[$block_namespace]['header'][$i];

				// Fetch the Block Pattern specified from a specific theme
				$pattern_data = $this->get_patterns($block_namespace, $block_pattern);
				// Check if Pattern data exists then concatenate it
				if(array_key_exists('content', $pattern_data)){
					$pattern_data['content'] = $pattern_data['content'] . $block_pattern_files[$i]['content'];
					$block_pattern_files[$i]['content'] = $pattern_data['content'];
				}
			}
		}

		return $block_pattern_files;
	}

	/**
	 * Retrieves the Homepage patterns approved by the Onboarding Module.
	 *
	 * @return array|\WP_Error
	 */
	public function get_homepage_patterns() {
		$block_pattern_files = array();

		// Iterate through all the themes that are approved
		foreach ( $this->block_namespace_slugs as $block_namespace ) {

			if(!isset($this->homepage_pattern_slugs[$block_namespace]['homepage']))
				return new \WP_Error(
					'Homepage Styles does not Exist',
					'The selected theme '. $block_namespace.' does not have any Homepage styles',
					array( 'status' => 404 )
				);

			// Fetch all the Patterns specific to a selected theme
			foreach ( $this->homepage_pattern_slugs[$block_namespace]['homepage'] as $block_pattern ) {

				// Fetch the Block Pattern specified from a specific theme
				$pattern_data = $this->get_patterns($block_namespace, $block_pattern);

				// Check if Pattern data is not NULL|Error and has data
				if(array_key_exists('content', $pattern_data))
					$block_pattern_files[] = $pattern_data;

			}

			$block_pattern_files = $this->add_header_patterns($block_namespace, $block_pattern_files);
		}

		return $block_pattern_files;
	}

}