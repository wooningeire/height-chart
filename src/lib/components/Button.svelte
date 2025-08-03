<script lang="ts">
    import type { Snippet } from "svelte";

let {
    children,
    onClick,
}: {
    children: Snippet,
    onClick?: () => void,
} = $props();
</script>

<button onclick={onClick}>
    {@render children?.()}
</button>

<style lang="scss">
@use "$lib/styles/raised.scss" as raised;

button {
    @include raised.container;

    padding: raised.$padding;

    transition:
        background 0.1s ease-in-out,
        filter 0.1s ease-in-out;
    cursor: pointer;

    &:hover,
    &:focus {
        background: oklch(1 0 0);
    }

    &:active {
        filter: brightness(0.8);
    }
}
</style>