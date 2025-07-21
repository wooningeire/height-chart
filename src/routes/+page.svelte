<script lang="ts">
import "./index.scss";
import {Canvas} from "@threlte/core";
import Scene from "./Scene.svelte";
import { SvelteMap } from "svelte/reactivity";
import * as THREE from "three";
import type { Character } from "$lib/types/Character";


const characters = $state(new SvelteMap<string, Character>());

let uploadedImage = $state<{url: string, file: File} | null>(null);

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files === null) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploadedImage = {
            url: reader.result as string,
            file,
        };
    });
    reader.readAsDataURL(file);
};

</script>

<main>
    <div class="controls">
        <label for="image-upload" class="upload-btn">
            Add
            <input 
                id="image-upload"
                type="file" 
                accept="image/*" 
                onchange={handleImageUpload}
            />
        </label>
        
        {#if characters.size > 0}
            <div class="image-list">
                <h3>Uploaded Images:</h3>
                {#each characters as [id, character] (id)}
                    <div class="image-item">
                        <img src={character.imageUrl} alt={character.name} />
                        <span>{character.name}</span>
                        <!-- <button onclick={() => removeImage(id)}>Remove</button> -->
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    
    <Canvas shadows={THREE.PCFSoftShadowMap}>
        <Scene
            {characters}
            {uploadedImage}
        />
    </Canvas>
</main>

<style lang="scss">
main {
    width: 100vw;
    height: 100vh;
    position: relative;
}

.controls {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 300px;
}

.upload-btn {
    display: inline-block;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
    
    &:hover {
        background: #0056b3;
    }
    
    input[type="file"] {
        display: none;
    }
}

.image-list {
    margin-top: 20px;
    
    h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
    }
}

.image-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
    
    img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    span {
        flex: 1;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    button {
        padding: 4px 8px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        
        &:hover {
            background: #c82333;
        }
    }
}
</style>