<script lang="ts">
import type { User } from '@supabase/supabase-js';
import { supabaseClient } from '$/lib/supabaseClient';
import Button from './Button.svelte';

let {
    onLoginSuccess,
}: {
    onLoginSuccess?: (user: User) => void,
} = $props();

const signInWithDiscord = async () => {
    try {
        // Get the Discord OAuth URL for popup
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                skipBrowserRedirect: true
            },
        });

        if (error) throw new Error(`Error getting Discord auth URL: ${error.message}`);
        if (!data.url) throw new Error('No auth URL received');

        // Open popup window
        const popup = window.open(
            data.url,
            'discord-login',
            'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
            throw new Error('Failed to open popup window. Please check your popup blocker settings.');
        }

        // Listen for the popup to be closed or to receive a message
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                // Check if login was successful
                checkLoginStatus();
            }
        }, 1000);

        // Listen for messages from the popup
        const messageListener = (event: MessageEvent) => {
            if (event.origin !== location.origin) return;
            
            if (event.data.type === 'discord-auth-success') {
                clearInterval(checkClosed);
                popup.close();
                window.removeEventListener('message', messageListener);
                checkLoginStatus();
            }
        };
        
        window.addEventListener('message', messageListener);

    } catch (err) {
        console.error('Discord login error:', err);
        throw err;
    }
};

const checkLoginStatus = async () => {
    // Check if user is now logged in
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (user && !error) {
        onLoginSuccess?.(user);
    }
};
</script>

<Button
    onClick={signInWithDiscord}
    ariaLabel="Attach Discord account"
>
    Attach Discord account
</Button>