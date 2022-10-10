<?php
namespace NewfoldLabs\WP\Module\Onboarding;

use NewfoldLabs\WP\Module\Onboarding\Data\Options;
use NewfoldLabs\WP\Module\Onboarding\Data\Config;

/**
 * Access and Modify WordPress Configuration (wp-config.php).
 */
class WP_Config {

	 /**
	  * @var \WPConfigTransformer
	  */
	 protected $wp_config;

	 /**
	  * @var array Store the list of allowed WP config options
	  */
	protected $allowed_options;

	function __construct() {
		 $this->wp_config = new \WPConfigTransformer( ABSPATH . 'wp-config.php' );
		 // fetch all the options that are allowed to be added or updated
		 $this->allowed_options = array_merge( Options::get_initialization_options(), Config::get_wp_config_initialization_constants(), Options::get_all_options());
	}

	 /**
	  * Adds a new constant to WordPress Configuration.
	  *
	  * @param mixed $name Name of the constant
	  * @param mixed $value Value of the constant
	  *
	  * @return boolean
	  */
	public function add_constant( $name, $value ) {
		if(!array_key_exists($name, $this->allowed_options)) {
			return false;
		}
		return $this->wp_config->add( 'constant', $name, $value, array( 'raw' => true ) );
	}

	 /**
	  * Updates an existing constant in WordPress Configuration.
	  *
	  * @param mixed $name Name of the constant
	  * @param mixed $value Value of the constant
	  *
	  * @return boolean
	  */
	public function update_constant( $name, $value ) {
		if(!array_key_exists($name, $this->allowed_options)) {
			return false;
		}
		return $this->wp_config->update( 'constant', $name, $value, array( 'raw' => true ) );
	}

	 /**
	  * Checks if the constant already exists in the WordPress Configuration.
	  *
	  * @param mixed $name Name of the constant.
	  *
	  * @return boolean
	  */
	public function constant_exists( $name ) {
		 return $this->wp_config->exists( 'constant', $name );
	}

}
