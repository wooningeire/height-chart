<script lang="ts">
import type { Character } from "$lib/types/Character";

let {
    character = $bindable(),
}: {
    character: Character,
} = $props();
</script>