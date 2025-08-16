<script lang="ts">
import { supabaseClient } from '$/lib/supabaseClient';
import { onMount } from 'svelte';

onMount(async () => {
    try {
        const { data, error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError !== null || data.session === null) {
            window.close();
            return;
        }

        const parent: Window = window.opener;
        
        if (parent !== null && !parent.closed) {
            parent.postMessage({ type: "discord-auth-success" }, window.location.origin);
            window.close();
        } else {
            window.location.replace("/");
        }
    } catch (err) {
        window.close();
    }
});
</script>
