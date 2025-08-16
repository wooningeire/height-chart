<script lang="ts">
    import type { Snippet } from "svelte";

let {
    children,
    onClick,
    ariaLabel,
}: {
    children: Snippet,
    onClick?: () => void,
    ariaLabel?: string,
} = $props();
</script>

<button
    onclick={onClick}
    aria-label={ariaLabel}
>
    <button-content>
        {@render children?.()}
    </button-content>
</button>

<style lang="scss">
@use "$lib/client/styles/box.scss" as box;

button {
    display: block;
    cursor: pointer;
    

    &:hover,
    &:focus {
        > button-content {
            --bg-stripe-opacity: 0.0625;

            transform: translateY(-0.25rem);
            animation: bg-slide 1s infinite linear;
            filter: brightness(1.25);

            @keyframes bg-slide {
                0% {
                    background-position-x: 0;
                }
                100% {
                    background-position-x: -2.82842712475rem; // 2 sqrt(2)
                }
            }
        }
    }

    &:active > button-content {
        --filter-duration: 0;

        transform: translateY(0);
        filter: brightness(0.8);
    }
}

button-content {
    @include box.raised;

    background-image:
        repeating-linear-gradient(
            -45deg,
            oklch(1 0 0 / var(--bg-stripe-opacity)) 0,
            oklch(1 0 0 / var(--bg-stripe-opacity)) 1rem,
            oklch(0 0 0 / 0) 1rem,
            oklch(0 0 0 / 0) 2rem
        );
    background-size: 200% 100%;


    display: block;
    padding: box.$padding;

    pointer-events: none;
    

    --filter-duration: 0.1s;
    --bg-stripe-opacity: 0;

    transition:
        background 0.1s ease-in-out,
        filter var(--filter-duration) ease-in-out,
        transform 0.5s cubic-bezier(0.25,3,0.25,1);
}
</style>