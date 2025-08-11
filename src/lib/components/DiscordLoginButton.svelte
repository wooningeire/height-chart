<script lang="ts">
import type { User } from '@supabase/supabase-js';
import { supabaseClient } from '$/lib/supabaseClient';
import Button from './Button.svelte';

const signInWithDiscord = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${location.origin}/auth/callback`
        },
    });

    if (error) throw new Error(`Error signing in with Discord: ${error.message}`);
}
</script>

<Button
    onClick={signInWithDiscord}
    ariaLabel="Sign in with Discord"
>
    Sign in with Discord
</Button>