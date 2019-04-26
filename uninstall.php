<?php
 
if( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) 
	exit();
register_uninstall_hook( __FILE__, 'control_vimeo_skipping_ld_uninstall_function' );
function control_vimeo_skipping_ld_uninstall_function()
{
  // code to run on plugin uninstall

  // delete the registered options
  delete_option('vimeo_video_skipping');
}	

?>