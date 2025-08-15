<script lang="ts">
let {
    avatarUrl,
    displayName,
    large = false,
}: {
    avatarUrl: string,
    displayName: string,
    large?: boolean,
} = $props();
</script>

<user-badge class:large>
    <img
        src={avatarUrl}
        alt="{displayName} avatar"
        loading="lazy"
    />

    <user-email>{displayName}</user-email>
    
</user-badge>

<style lang="scss">
user-badge {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    &.large {
        gap: 1rem;

        img {
            width: 3rem;
            height: 3rem;
            border-radius: 0.5rem;
        }
    }
}

img {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
}

user-email {
    font-weight: 700;
}
</style>