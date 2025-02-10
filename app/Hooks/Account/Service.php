<?php

namespace App\Hooks\Account;

class Service {
    public static function rest_prepare_user(
        $response,
        $user,
        $request
    ) {
        $user_id = $user->ID;
        $preferred_language = get_user_meta($user_id, 'preferred_language', true);

        $response->data = array_merge($response->data, array(
            'id' => $user_id,
            'email' => $user->user_email,
            'name' => $user->user_firstname,
            'last_name' => $user->user_lastname,
            'phone' => get_user_meta($user_id, 'phone', true),
            'opt_in_updates' => (int)get_user_meta($user_id, 'opt_in_updates', true),
            'opt_in_commercial' => (int)get_user_meta($user_id, 'opt_in_commercial', true),
            'preferred_language' => $preferred_language ?? get_locale(),
        ));
        return $response;
    }
}