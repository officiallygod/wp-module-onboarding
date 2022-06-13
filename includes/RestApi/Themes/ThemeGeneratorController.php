<?php
namespace NewfoldLabs\WP\Module\Onboarding\RestApi\Themes;

use NewfoldLabs\WP\Module\Onboarding\Permissions;
use NewfoldLabs\WP\Module\Onboarding\Data\Flow;
use NewfoldLabs\WP\Module\Onboarding\Data\Data;
use NewfoldLabs\WP\Module\Onboarding\Mustache\Mustache;

/**
 * Class ThemeGeneratorController
 */
class ThemeGeneratorController {
     /**
     * @var string
     */
     protected $namespace = 'newfold-onboarding/v1';

    /**
     * @var string
     */
    protected $rest_base = '/themes';

    public function register_routes() {
         \register_rest_route(
              $this->namespace,
              $this->rest_base . '/child/generate',
              array(
                   array(
                        'methods'             => \WP_Rest_Server::CREATABLE,
                        'callback'            => array( $this, 'generate_child_theme' ),
                        'permission_callback' => array( Permissions::class, 'rest_can_manage_themes' )
                   )
              )
         );
     }

     /**
      * Generates the child theme from an active parent theme.
      * 
      * @return \WP_REST_Respone|\WP_Error
      */
     public function generate_child_theme() {
          // Connect to the wordpress file system.
          if ( ! $this->connect_to_filesystem() ) {
               return new \WP_Error(
                    'nfd_onboarding_error',
                    'Could not connect to the filesystem.',
                    array( 'status' => 500 )
               );
          }

          // [TODO] Replace this to get data from wp_option
          // Retrieve the flow data
          // Ensure that we have sufficient data to generate a child theme.
          $flow_data = Flow::get_flow_data()['data'];
          $valid_flow_data = $this->validate_flow_data( $flow_data );
          if ( ! $valid_flow_data ) {
               return new \WP_Error(
                    'nfd_onboarding_error',
                    'Flow data is incomplete to generate a child theme.',
                    array( 'status' => 500 )
               );
          }

          // Check if the parent theme exists.
          $parent_theme_slug = $flow_data['theme']['template'];
          $parent_theme_exists = ( \wp_get_theme( $parent_theme_slug ) )->exists();
          if ( ! $parent_theme_exists ) {
               return new \WP_Error(
                    'nfd_onboarding_error',
                    'Parent theme is missing to generate the child theme.',
                    array( 'status' => 500 )
               );
          }

          /* Activate the parent theme if it is not active. 
          This is necessary to register the parent theme's block patterns. */
          $active_theme = ( \wp_get_theme() )->get( 'TextDomain' );
          if ( $active_theme !== $parent_theme_slug ) {
               $this->activate_theme( $parent_theme_slug );
          }

          // Generate the necessary slugs and paths.
          $themes_dir = dirname( \get_stylesheet_directory() );
          $parent_theme_dir = $themes_dir . '/' . $parent_theme_slug;
          $child_theme_slug = $this->get_child_theme_slug( $flow_data );
          $child_theme_dir = $themes_dir . '/' . $child_theme_slug;

          // Generate theme.json data for the child theme.
          $theme_json_data = $this->generate_child_theme_json( $flow_data, $parent_theme_dir );
          if ( ! $theme_json_data ) {
               return new \WP_Error(
                    'nfd_onboarding_error',
                    'Could not generate theme.json',
                    array( 'status' => 500 )
               );
          }

          // Generate the pattern for a given header part to place it into the relevant HTML file.
          if ( $flow_data['partHeader'] ) {
               $part_patterns['header'] = $this->generate_theme_part_pattern( $flow_data['partHeader'] );
               if ( \is_wp_error( $part_patterns['header'] ) ) {
                    return $part_patterns['header'];
               }
          }

          // Write the child theme to the filesystem under themes.
          $child_theme_written = $this->write_child_theme(
               $parent_theme_slug,
               $child_theme_slug,
               $child_theme_dir,
               \wp_json_encode( $theme_json_data ),
               $part_patterns
          );

          if ( $child_theme_written !== true ) {
               return new \WP_Error(
                    'nfd_onboarding_error',
                    $child_theme_written,
                    array( 'status' => 500 )
               );
          }

          // Activate the child theme.
          $this->activate_theme( $child_theme_slug );

          return new \WP_REST_Response(
               null,
               200
          );
     }

     /**
      * Get the child theme stylesheet from flow data.
      * 
      * @param array $flow_data
      * 
      * @return string
      */
     protected function get_child_theme_slug( $flow_data ) {
          if ( $flow_data['theme']['template'] === $flow_data['theme']['stylesheet'] ) {
               $current_brand = Data::current_brand();
               return $current_brand['brand'] . '-' . \sanitize_title_with_dashes( \get_bloginfo( 'name' ) );
          }
          return $flow_data['theme']['stylesheet'];
     }

     /**
      * Activates a given theme.
      * 
      * @param string $theme wordpress slug for theme
      * 
      * @return void
      */
     protected function activate_theme( $theme_slug ) {
          \switch_theme( $theme_slug );
     }

     /**
      * Generates the child theme.json from the relevant parent theme.json
      * 
      * @param array $flow_data
      * @param string $parent_theme_dir
      * 
      * @return boolean|array
      */
     protected function generate_child_theme_json( $flow_data, $parent_theme_dir ) {
          global $wp_filesystem;

          if ( $flow_data['theme']['variation'] ) {
               $theme_json_file = $parent_theme_dir . '/styles/' . $flow_data['theme']['variation'] . '.json';
          } else {
               $theme_json_file = $parent_theme_dir . '/theme.json';
          }
          if ( ! $wp_filesystem->exists( $theme_json_file ) ) {
               return false;
          }

          $theme_json = $wp_filesystem->get_contents( $theme_json_file );
          $theme_json_data = json_decode( $theme_json, true );

          if ( ! $flow_data['customDesign'] ) {
               return $theme_json_data;
          }

          if ( $flow_data['palette'] ) {
               $theme_json_data['settings']['color']['palette'] = $flow_data['palette'];
          }
          if ( $flow_data['typography']['fontFamilies'] ) {
               $theme_json_data['settings']['typography']['fontFamilies'] = $flow_data['typography']['fontFamilies'];
          }
          if ( $flow_data['typography']['fontSizes'] ) {
               $theme_json_data['settings']['typography']['fontSizes'] = $flow_data['typography']['fontSizes'];
          }

          return $theme_json_data;
     }

     /**
      * Get the pattern for the theme part.
      * 
      * @param string $part
      * 
      * @return string the pattern for the part.
      */
     protected function generate_theme_part_pattern( $pattern_slug ) {
          $pattern = \WP_Block_Patterns_Registry::get_instance()->get_registered( $pattern_slug );
          if ( ! $pattern ) {
               return new \WP_Error(
                    'nfd_onboarding_pattern_not_registered',
                    "{$pattern_slug} has not been registered. Please retry.",
                    array( 'status' => 500 )
               );
          }

          return $pattern['content'];
     }

     /**
      * Write the child theme to the themes directory.
      * 
      * @param string $parent_theme_slug
      * @param string $child_theme_slug
      * @param string $child_theme_dir
      * @param array $theme_json
      * @param array $part_patterns
      * 
      * @return string|boolean
      */
     protected function write_child_theme( $parent_theme_slug, $child_theme_slug, $child_theme_dir, $theme_json, $part_patterns ) {

          $child_directory_created = $this->create_directory( $child_theme_dir );
          if ( ! $child_directory_created ) {
               return 'Error creating child directory.';
          }

          $theme_json_written = $this->write_theme_json( $child_theme_dir, $theme_json );
          if ( ! $theme_json_written ) {
               return 'Error writing theme.json.';
          }

          $template_parts_written = $this->write_template_parts( $child_theme_dir, $part_patterns );
          if ( ! $template_parts_written ) {
               return 'Error writing template part.';
          }

          $child_stylesheet_written = $this->write_child_stylesheet( $parent_theme_slug, $child_theme_slug, $child_theme_dir );
          if ( ! $child_stylesheet_written ) {
               return 'Error writing stylesheet.';
          }

          $index_php_written = $this->write_index_php( $child_theme_dir );
          if ( ! $index_php_written ) {
               return 'Error writing index.php.';
          }

          return true;
     }

     /**
      * Creates a directory if necessary.
      * 
      * @param string $dir
      * 
      * @return boolean
      */
     protected function create_directory( $dir ) {
          global $wp_filesystem;

          if ( ! $wp_filesystem->exists( $dir ) ) {
               return $wp_filesystem->mkdir( $dir );
          }

          return true;
     }

     /**
      * Writes $theme_json to a theme's theme.json file.
      * 
      * @param string $theme_dir
      * @param string $theme_json
      * 
      * @return boolean
      */
     protected function write_theme_json( $theme_dir, $theme_json ) {
          return $this->write_to_filesystem( $theme_dir . '/' . 'theme.json', $theme_json );
     }

     /**
      * Writes HTML template parts to the theme's parts directory.
      * 
      * @param string $theme_dir
      * @param array $part_patterns
      * 
      * @return boolean
      */
     protected function write_template_parts( $theme_dir, $part_patterns ) {
          global $wp_filesystem;

          if ( ! $wp_filesystem->exists( $theme_dir . '/parts' ) ) {
               $parts_directory_created = mkdir( $theme_dir . '/parts' );
               if ( ! $parts_directory_created ) {
                    return false;
               }
          }
          foreach ( $part_patterns as $part => $pattern ) {
               $status = $this->write_to_filesystem( $theme_dir . "/parts/{$part}.html", $pattern );
               if ( ! $status ) {
                    return false;
               }
          }

          return true;
     }

     /**
      * Writes style.css for the child theme.
      * 
      * @param string $parent_theme_slug
      * @param string $child_theme_slug
      * @param string $theme_dir
      * 
      * @return boolean
      */
     protected function write_child_stylesheet( $parent_theme_slug, $child_theme_slug, $theme_dir ) {
          $current_brand = Data::current_brand();
          $customer = \wp_get_current_user();

          $theme_style_data = array(
               'current_brand'     => Data::current_brand(),
               'brand'             => $current_brand['brand'],
               'brand_name'        => $current_brand['name'] ? $current_brand['name'] : 'Newfold Digital',
               'site_title'        => \get_bloginfo( 'name' ),
               'site_url'          => \site_url(),
               'author'            => $customer->user_firstname,
               'parent_theme_slug' => $parent_theme_slug,
               'child_theme_slug'  => $child_theme_slug
          );

          $mustache = new Mustache();
          $theme_style_comment = $mustache->render_template( 'themeStylesheet', $theme_style_data );
          return $this->write_to_filesystem( $theme_dir . '/style.css', $theme_style_comment);
     }

     /**
      * Writes index.php for the child theme.
      * 
      * @param string $theme_dir
      * 
      * @return boolean
      */
     public function write_index_php( $theme_dir ) {
          $theme_index_php = '<?php';
          return $this->write_to_filesystem( $theme_dir . '/index.php', $theme_index_php);
     }

     /**
      * Checks if $flow_data has all the necessary data to generate a child theme.
      * 
      * @param array $flow_data
      * 
      * @return boolean
      */
     protected function validate_flow_data( $flow_data ) {
          if (! $flow_data || ! $flow_data['theme']['template'] || ! $flow_data['theme']['stylesheet'] ) {
               return false;
          }
          if ( $flow_data['customDesign'] ) {
               if ( ! $flow_data['palette'] && ! $flow_data['typography'] ) {
                    return false;
               }
          }

          return true;
     }

     protected function write_to_filesystem( $file, $content ) {
          global $wp_filesystem;

          return $wp_filesystem->put_contents(
               $file,
               $content,
               FS_CHMOD_FILE // predefined mode settings for WP files
          );
     }

     protected function connect_to_filesystem() {
          require_once ABSPATH . 'wp-admin/includes/file.php';

          $access_type = \get_filesystem_method();
          if ( $access_type !== 'direct' ) {
               return false;
          }

          $creds = \request_filesystem_credentials( site_url() . '/wp-admin', '', false, false, array() );

          if ( ! \WP_Filesystem( $creds ) ) {
               return false;
          }

          return true;
     }
}
