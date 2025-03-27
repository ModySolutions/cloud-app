<?php

if (!function_exists('app_is_page_allowed')) {
    function app_is_page_allowed(int $page_id, array $allowed_pages): bool
    {
        $is_allowed_page = false;
        foreach ($allowed_pages as $slug) {
            $page = get_page_by_path($slug);
            if ($page && ($page_id == $page->ID || wp_get_post_parent_id($page_id) == $page->ID)) {
                $is_allowed_page = true;
                break;
            }
        }
        return $is_allowed_page;
    }
}
