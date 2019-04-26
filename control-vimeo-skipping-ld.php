<?php
/*
 * Plugin Name: Control Vimeo Skipping for LearnDash
 * Plugin URI: 
 * Description: Control video seeking for LearnDash Vimeo videos. 
 * Version: 1.0.0
 * Author: Amy Singleton
 * Author URI: 
 * License: GPL v2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: control-vimeo-skipping-ld
 * Domain Path: 
 */

 
/**
 * Exit if accessed directly.
 */
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Detect plugin. For use on Front End only.
 */
include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
//Check to see if LearnDash is Active
if( is_plugin_active( 'sfwd-lms/sfwd_lms.php' ) ) {
	// Plugin is active
	// Create a metabox(s) for lessons and topics
	function add_vimeo_settings_metabox(){
	    add_meta_box("vimeo-meta-box", "Control Vimeo Seeking", "display_vimeo_metabox_setting_fields", "sfwd-lessons", "side", "high", null);
	    add_meta_box("vimeo-meta-box", "Control Vimeo Seeking", "display_vimeo_metabox_setting_fields", "sfwd-topic", "side", "high", null);
	}
	add_action("admin_init", "add_vimeo_settings_metabox");
	
	//add setting feilds to allow admins to control vimeo player seeking on 
	function display_vimeo_metabox_setting_fields($video_settings){
	    wp_nonce_field(basename(__FILE__), "meta-box-nonce");
	
	    $vimeo_video_skipping = esc_html( get_post_meta( $video_settings->ID, 'vimeo_video_skipping', true ) ); ?>
		<table>
			<tr>
				<td style="width: 100%">
					<?php echo '<label for="video_skipping">';
					 _e('Check the box to prevent learners from seeking through Vimeo videos.', 'boss-child' );
					echo '</label> '; ?>
				</td>
				<td>
					<?php echo '<input type="checkbox" name="video_skipping" value="true"';
					echo  ($vimeo_video_skipping) ? 'checked': '';
					echo '/>'; ?>
				</td>
			</tr>
		</table>
	    <?php  
	}
	
	//save metabox(s) setting fields
	function save_custom_meta_box($video_settings_id, $video_settings){
		$old = get_post_meta($video_settings_id, 'vimeo_video_skipping',true);
		if ( isset( $_POST['video_skipping'] ) && $_POST['video_skipping'] == 'true' ) {
		    update_post_meta( $video_settings_id, 'vimeo_video_skipping', $_POST['video_skipping'] );
		}
		else{
		    if (!empty($old)){
			delete_post_meta($video_settings_id, 'vimeo_video_skipping');
		    }
		}
	}
	add_action('save_post', 'save_custom_meta_box', 10, 3);
	
	//Enqueue scripts to conditionally control users ability to seek through the vimeo player timeline
	$control_vimeo_video_meta = get_post_meta( get_the_ID(), 'vimeo_video_skipping', true ) ;
	function control_vimeo_skipping(){
		if (is_singular( array( 'sfwd-lessons', 'sfwd-topic'))){
			if ( get_post_meta( get_the_ID(), 'vimeo_video_skipping', true )){
				//echo 'Checked equals: checked';//For Testing Purposes
				 add_action( 'wp_footer', function () {
					wp_enqueue_script( 'control-vimeo-skipping-vimeo-player-scripts',  'https://player.vimeo.com/api/player.js', true);
					wp_enqueue_script( 'control-vimeo-ld-custom-scripts',  plugin_dir_url( __FILE__ ).'js/control-vimeo-player-script.js', true);
				    }, 10);
			}
		}
	}
	add_action('dynamic_sidebar_after','control_vimeo_skipping');
    }//End if plugin SWFD_LMS is active i.e. LearnDash
?>