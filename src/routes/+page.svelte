<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import {PCFSoftShadowMap} from "three";
import { Character } from "$/lib/types/Character.svelte";
import CharacterAddForm from "./CharacterAddForm.svelte";
import CharacterListitem from "./CharacterListitem.svelte";
import { onMount } from "svelte";
import { loadCharacter } from "$/lib/loadCharacter";
import { supabaseClient } from "$/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import DiscordLoginButton from "$/lib/components/DiscordLoginButton.svelte";
import DiscordLogoutButton from "$/lib/components/DiscordLogoutButton.svelte";
import UserBadge from "$/lib/components/UserBadge.svelte";


const characters = $state(new SvelteMap<string, Character>());

const sortedCharacters = $derived(
    characters.entries()
        .toArray()
        .sort((a, b) => a[1].referenceCurve.targetScaleFac - b[1].referenceCurve.targetScaleFac)
);

let addedCharacter = $state<Character | null>(null);


const loadCharacters = async () => {
    try {
        const response = await fetch("/api/character");
        if (!response.ok) {
            console.error("Failed to load characters");
            return;
        }

        const charactersData = await response.json();

        const loadedCharacters = await Promise.all(
            charactersData.map((characterData: any) => loadCharacter(characterData))
        );

        for (const character of loadedCharacters) {
            characters.set(character.id!, character);
        }
    } catch (error) {
        console.error("Failed to fetch characters:", error);
    }
};

onMount(() => {
    loadCharacters();
});


const userPromise = supabaseClient.auth.getUser();

let user = $state<User | null>(null);
let userLoaded = $state(false);
onMount(async () => {
    user = (await userPromise).data.user;
    userLoaded = true;
});
</script>

<main>
    <character-overlay>
        {#if userLoaded}
            {#if user === null}
                <DiscordLoginButton />
            {:else}
                <UserBadge {user} />
                <DiscordLogoutButton />
            {/if}
            
        {/if}

        <CharacterAddForm
            onCreate={character => addedCharacter = character}
            onCancel={() => addedCharacter = null}
            onSubmit={character => {
                addedCharacter = null;

                if (character.id) {
                    characters.set(character.id, character);
                }
            }}
        />

        {#if characters.size > 0}
            <character-list>
                <h3>Characters</h3>
                {#each sortedCharacters as [id, character] (id)}
                    <CharacterListitem {character} />
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
}

scene-container {
    flex-grow: 1;
    flex-shrink: 1;
    user-select: none;
}


img {
    max-height: 10rem;
    object-fit: contain;

    filter: drop-shadow(0 0.0625rem 0.0625rem oklch(0 0 0 / 0.125));
}

character-list {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: stretch;
}

</style>