<script lang="ts">
import { goto } from '$app/navigation';
import { supabaseClient } from '$/lib/supabaseClient';
import { onMount } from 'svelte';

onMount(async () => {
  await supabaseClient.auth.exchangeCodeForSession(window.location.href);
  goto('/');
});
</script>

<p>Signing you in…</p>


