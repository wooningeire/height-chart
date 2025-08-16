<script lang="ts">
// External libraries
import {Canvas} from "@threlte/core";
import {PCFSoftShadowMap} from "three";
import type { User } from "@supabase/supabase-js";

// Svelte framework
import { onMount } from "svelte";
import { SvelteMap } from "svelte/reactivity";

// Local components and utilities
import { Character } from "$/lib/client/types/Character.svelte";
import { CharacterWithOwner } from "$/lib/client/types/CharacterWithOwner.svelte";
import { loadCharacter } from "$/lib/client/loadCharacter";
import { supabaseClient } from "$/lib/client/supabaseClient";
import DiscordLoginButton from "$/lib/client/components/DiscordLoginButton.svelte";
import DiscordLogoutButton from "$/lib/client/components/DiscordLogoutButton.svelte";
import UserBadge from "$/lib/client/components/UserBadge.svelte";

// Local route components
import Scene from "./Scene.svelte";
import CharacterAddForm from "./CharacterAddForm.svelte";
import CharacterListitem from "./CharacterListitem.svelte";

// Styles
import "./index.scss";


const characters = $state(new SvelteMap<string, CharacterWithOwner>());

const sortedCharacters = $derived(
    characters.entries()
        .map(([id, characterWithOwner]) => [id, characterWithOwner.character] as [string, Character])
        .toArray()
        .sort((a, b) => a[1].referenceCurve.targetScaleFac - b[1].referenceCurve.targetScaleFac)
);

let addedCharacter = $state<Character | null>(null);


const loadCharacters = async () => {
    try {
        const response = await fetch("/api/character");
        if (!response.ok) {
            throw new Error("Failed to load characters");
        }

        const charactersData = await response.json();

        const loadedCharacters = await Promise.all(
            charactersData.map((characterData: any) => loadCharacter(characterData))
        );

        for (const character of loadedCharacters) {
            characters.set(character.id!, character);
        }
    } catch (error) {
        throw new Error("Failed to fetch characters");
    }
};

onMount(() => {
    loadCharacters();
});


const userPromise = supabaseClient.auth.getUser();
const sessionPromise = supabaseClient.auth.getSession();

let user = $state.raw<User | null>(null);
let userLoaded = $state(false);
onMount(async () => {
    const [userResponse, sessionResponse] = await Promise.all([userPromise, sessionPromise]);

    user = userResponse.data.user;
    userLoaded = true;

    if (user === null || sessionResponse.data.session === null) return;


    const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${sessionResponse.data.session.access_token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to login");

    for (const [id, characterWithOwner] of characters) {
        if (characterWithOwner.ownerUserId !== BigInt(user.user_metadata.provider_id)) continue;
        characterWithOwner.ownerAvatarUrl = user.user_metadata.avatar_url;
        characterWithOwner.ownerDisplayName = user.user_metadata.full_name;
    }
});
</script>

<main>
    <character-overlay>
        {#if userLoaded}
            {#if user === null}
                <DiscordLoginButton onLoginSuccess={(newUser: User) => { user = newUser; }} />
            {:else}
                <UserBadge
                    avatarUrl={user.user_metadata.avatar_url}
                    displayName={user.user_metadata.full_name}
                    large
                />

                <DiscordLogoutButton
                    onLogout={() => {
                        user = null;
                    }}
                />
            {/if}
            
        {/if}

        <CharacterAddForm
            onCreate={character => addedCharacter = character}
            onCancel={() => addedCharacter = null}
            onSubmit={character => {
                addedCharacter = null;

                if (user === null) return;

                if (character.id) {
                    characters.set(character.id, new CharacterWithOwner({
                        character,
                        ownerUserId: BigInt(user.id),
                        ownerAvatarUrl: user.user_metadata.avatar_url,
                        ownerDisplayName: user.user_metadata.full_name,
                    }));
                }
            }}
        />

        {#if characters.size > 0}
            <character-list>
                <h3>Characters</h3>
                {#each sortedCharacters as [id, character] (id)}
                    <CharacterListitem characterWithOwner={characters.get(id)!} />
                {/each}
            </character-list>
        {/if}
    </character-overlay>
    
    <scene-container>
        <Canvas shadows={PCFSoftShadowMap}>
            <Scene
                characters={sortedCharacters}
                {addedCharacter}
            />
        </Canvas>
    </scene-container>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: stretch;
}

character-overlay {
    padding: 1rem;
    width: 16rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
}

scene-container {
    flex-grow: 1;
    display: block;
    width: 0;

    user-select: none;
}

character-list {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
}

</style>