<script lang="ts">
    import type { Snippet } from "svelte";

let {
    id,
    children,
}: {
    id?: string,
    children?: Snippet,
} = $props();
</script>

<label for={id}>{@render children?.()}</label>

<style lang="scss">
@use "$lib/styles/box.scss" as box;

label {
    padding: box.$padding box.$padding box.$padding 0;
    margin-bottom: -0.25rem;

    font-size: 0.8rem;
    opacity: 0.75;
    line-height: 1;
}
</style>
