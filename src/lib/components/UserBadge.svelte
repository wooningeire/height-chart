<script lang="ts">
import type { User } from "@supabase/supabase-js";

let {
    user,
}: {
    user: User,
} = $props();
</script>

<user-badge>
    <img
        src={user.user_metadata.avatar_url}
        alt="{user.user_metadata.full_name} avatar"
        loading="lazy"
    />

    <user-email>{user.user_metadata.full_name}</user-email>
</user-badge>

<style lang="scss">
user-badge {
    display: flex;
    gap: 1rem;
    align-items: center;
}

img {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
}

user-email {
    font-weight: 700;
}
</style>