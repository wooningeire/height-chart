<script lang="ts">
import { Character } from "$/lib/types/Character.svelte";
import Button from "@/Button.svelte";
import Separator from "@/Separator.svelte";
import {Texture, Vector3, TextureLoader, SRGBColorSpace} from "three";
import NumberEntry from "@/NumberEntry.svelte";
import {CompositeCurve} from "$/lib/types/CompositeCurve.svelte";
import { Bezier } from "$/lib/types/Bezier.svelte";
import TextEntry from "@/TextEntry.svelte";
    import { createTextureFromFile, createTextureFromUrl } from "$/lib/createTexture";

    
let {
    onCreate,
    onCancel,
    onSubmit,
}: {
    onCreate?: (character: Character) => void,
    onCancel?: () => void,
    onSubmit?: (character: Character) => void,
} = $props();

let addedCharacter = $state.raw<Character | null>(null);


let fileInputEl = $state<HTMLInputElement>()!;
const handleImageUpload = async () => {
    const files = fileInputEl.files;
    
    if (files === null) return null;
    const file = files[0];

    if (!file.type.startsWith("image/")) return null;

    const {url, texture} = await createTextureFromFile(file);

    if (addedCharacter === null) {
        addedCharacter = new Character({
            name: file.name,
            imageUrl: url,
            file,
            texture,
            referenceCurve: new CompositeCurve({
                segments: [
                    new Bezier({
                        start: new Vector3(0.125, 0.125, 0),
                        end: new Vector3(0.875, 0.875, 0),
                    }),
                ],
                targetLength: 1,
            }),
            offsetPos: new Vector3(texture.width / texture.height / 2, 0, 0),
        });

        onCreate?.(addedCharacter);
    } else {
        addedCharacter.imageUrl = url;
        addedCharacter.texture = texture;
        addedCharacter.offsetPos = new Vector3(texture.width / texture.height / 2, 0, 0);
    }
};

const id = $props.id();

const cancel = () => {
    onCancel?.();
    addedCharacter = null;
};

const submit = async () => {
    if (addedCharacter === null) return;

    const file = addedCharacter.file;
    if (file === null) return;

    const formData = new FormData();
    formData.append('name', addedCharacter.name);
    formData.append('targetLength', addedCharacter.referenceCurve.targetLength.toString());
    formData.append('offsetPos', JSON.stringify(addedCharacter.offsetPos.toArray()));
    formData.append('offsetScale', JSON.stringify([1, 1, 1]));
    formData.append('referenceCurve', JSON.stringify(addedCharacter.referenceCurve.segments.map(segment => {
        return [
            segment.start.toArray(),
            segment.end.toArray(),
            (segment.startDeriv ?? segment.start).toArray(),
            (segment.endDeriv ?? segment.end).toArray(),
        ];
    })));
    formData.append('file', file);

    const response = await fetch("/api/character", {
        method: "PUT",
        body: formData,
    });

    if (!response.ok) return;
    const { id, imageUrl } = await response.json();

    addedCharacter.id = id.toString();
    addedCharacter.imageUrl = imageUrl;
    addedCharacter.texture = await createTextureFromUrl(imageUrl);

    onSubmit?.(addedCharacter);
    addedCharacter = null;
};

const addCharacterText = $derived(addedCharacter === null ? "Add a character" : "Replace image");
</script>


<added-character-details>
    <Button
        onClick={() => fileInputEl.click()}
        ariaLabel={addCharacterText}
    >
        {addCharacterText}
    </Button>

    {#if addedCharacter !== null}
        <Button onClick={cancel} ariaLabel="Cancel">
            Cancel
        </Button>

        <added-character-image>
            <img
                src={addedCharacter.imageUrl}
                alt="Character preview"
            />
        </added-character-image>

        <Separator />

        <div>
            <TextEntry
                value={addedCharacter.name}
                label="Character name"
                onValueChange={value => {
                    if (addedCharacter === null) return;
                    addedCharacter.name = value;
                }}
            />
        </div>

        <div>
            <NumberEntry
                value={addedCharacter.referenceCurve.targetLength}
                label="Length of reference curve"
                onValueChange={value => {
                    if (addedCharacter === null) return;
                    addedCharacter.referenceCurve.targetLength = value;
                }}
            />
        </div>

        <Separator />

        <Separator />

        <Button
            onClick={submit}
            ariaLabel="Submit"
        >
            Submit
        </Button>
    {/if}
</added-character-details>
        
<input 
    id="image-upload-{id}"
    type="file" 
    accept="image/*" 
    onchange={handleImageUpload}
    bind:this={fileInputEl}
    aria-label="Upload character image"
/>

<style lang="scss">
added-character-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

added-character-image {
    display: grid;
    place-items: center;
    width: 100%;
    max-height: 10rem;
}

input[type="file"] {
    display: none;
}


img {
    width: 100%;
    max-height: 10rem;
    object-fit: contain;

    filter: drop-shadow(0 0.0625rem 0.0625rem oklch(0 0 0 / 0.125));
}
</style>