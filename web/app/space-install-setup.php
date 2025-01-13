<?php

namespace App\Web;

$installing = isset($_GET['installing']);
define('WP_INSTALLING', $installing);
require_once '../wp/wp-load.php';

require_once '../../vendor/autoload.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';

if (!function_exists('app_install_get_subdomain')) {
    function app_install_get_subdomain(): string
    {
        $host = parse_url($_SERVER['HTTP_HOST'], PHP_URL_HOST) ?? $_SERVER['HTTP_HOST'];
        $parts = explode('.', $host);

        if (count($parts) > 2) {
            array_pop($parts);
            array_pop($parts);
        }
        return implode('.', $parts);
    }
}

$sub_domain = app_install_get_subdomain();
$env_file_path = "../../config/sites/{$sub_domain}/.env";
if (!$sub_domain && !file_exists($env_file_path)) {
    wp_die(__('There was an error creating your site.'));
}

$env_file = file_get_contents($env_file_path);
require_once '../../src/app/helpers/parse.php';
$parsed_env_file = parse_env_text($env_file);
if (count($parsed_env_file) === 0) {
    return '';
}
extract($parsed_env_file);
if (!is_blog_installed()) {
    wp_install(
        $company_name,
        $admin_email,
        $admin_email,
        false,
        false,
        wp_generate_password(),
        'es_ES',
    );
}
?>
<style>
    body {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-family: "Open Sans", sans-serif;
    }

    .ellipsis-animation {
        font-weight: bold;
        display: inline-block;
    }

    .dots {
        display: inline-block;
        width: 0;
        overflow: hidden;
        animation: ellipsis 1.5s infinite step-end;
    }

    @keyframes ellipsis {
        0% {
            width: 0;
        }
        33% {
            width: 1ch;
        }
        66% {
            width: 2ch;
        }
        100% {
            width: 3ch;
        }
    }

    }
</style>
<div class="wizard flex justify-center items-center radius-md rounded">
    <div class="setup-wizard-intro my-3">
        <h2 class="text-center mb-3 ellipsis-animation">
            Please wait while we set up your space
            <span class="dots">...</span>
        </h2>
        <pre id="loading-container"></pre>
    </div>
</div>
<script>
    let i = 0;
    const checkSignIn = setInterval(async () => {
        const response = await fetch(`ping.php?i=${i}`, {'method': 'GET'});
        if (response.ok) {
            const {data: {done, initial_page, message}} = await response.json();
            if (done) {
                clearInterval(checkSignIn);
                location.href = initial_page;
            }

            document.getElementById('loading-container')
                .innerText += `${message}\n`;
            i++;
        }
    }, 3000)
</script>