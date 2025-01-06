<?php

require_once '../wp/wp-load.php';

if (get_option('scaffold_default_posts')) {
    if (is_user_logged_in()) {
        wp_redirect(site_url());
        exit;
    } elseif(!is_user_logged_in() && !array_key_exists('initial_page', $_GET)) {
        wp_redirect(wp_login_url());
        exit;
    }
}
$initial_page = $_GET['initial_page'] ?? site_url(); ?>
<div class="wizard flex justify-center items-center radius-md rounded">
    <div class="setup-wizard-intro my-3">
        <h2 class="text-center mb-3"><?php _e('Please wait while we set up your space...');?></h2>
    </div>
</div>
<script>
    const initial_page = '<?php echo urldecode($initial_page); ?>'
    const checkSignIn = setInterval(async() => {
        const response = await fetch('ping.php', {'method': 'GET'});
        if(response.ok) {
            const {data: {done}} = await response.json();
            if(done) {
                clearInterval(checkSignIn);
                location.href=initial_page;
            }
        }
    }, 3000)
</script>