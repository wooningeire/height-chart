<script lang="ts">
import { supabaseClient } from '$/lib/supabaseClient';
import Button from "./Button.svelte";

const signOut = async () => {
    await supabaseClient.auth.signOut();
}
</script>

<Button
    onClick={signOut}
    ariaLabel="Sign out"
>
    Sign out
</Button>