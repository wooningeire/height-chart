<script lang="ts">
import { supabaseClient } from '$/lib/supabaseClient';
import Button from "./Button.svelte";

let {
    onLogout,
}: {
    onLogout?: () => void,
} = $props();

const logout = async () => {
    await supabaseClient.auth.signOut();
    onLogout?.();
}
</script>

<Button
    onClick={logout}
    ariaLabel="Logout"
>
    Logout
</Button>