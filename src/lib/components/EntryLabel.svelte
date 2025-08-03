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
@use "$lib/styles/raised.scss" as raised;

label {
    padding: raised.$padding raised.$padding raised.$padding 0;
    margin-bottom: -0.25rem;

    font-size: 0.8rem;
    opacity: 0.75;
    line-height: 1;
}
</style>
