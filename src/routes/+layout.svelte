<script lang="ts">
import type { Snippet } from "svelte";
import ModifierKeys from "./ModifierKeys.svelte";

let {
    children,
}: {
    children: Snippet,
} = $props();
</script>

{@render children?.()}

<ModifierKeys />