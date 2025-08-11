<script lang="ts">
import {TextInput} from "@vaie/hui";
    import EntryLabel from "./EntryLabel.svelte";

let {
    value,
    onValueChange,
    placeholder = null,
    validate,
    disabled,
    id,
    label,
}: {
    value: string,
    onValueChange: (value: string) => void,
    placeholder?: string | null,
    validate?: (value: string) => boolean,
    disabled?: boolean,
    id?: string,
    label?: string,
} = $props();
</script>

<text-entry-total-container>
    <EntryLabel {id}>{label}</EntryLabel>

    <text-entry-container>
        <TextInput
            {value}
            {onValueChange}
            placeholderText={placeholder ?? ""}
            {validate}
            {disabled}
        >
            {#snippet container({contents})}
                <text-entry-input-container>
                    {@render contents()}
                </text-entry-input-container>
            {/snippet}

            {#snippet input({localText, onLocalTextChange, el, onElChange, elProps, valid})}
                <text-entry-input
                    bind:this={() => el, onElChange}
                    bind:textContent={() => localText, onLocalTextChange}
                    {...elProps}
                    contenteditable
                    class:invalid={!valid}
                    aria-label={label}
                ></text-entry-input>
            {/snippet}
        </TextInput>
    </text-entry-container>
</text-entry-total-container>


<style lang="scss">
@use "$lib/styles/raised.scss" as raised;

text-entry-total-container {
    display: flex;
    flex-direction: column;
}

text-entry-container {
    @include raised.container;

    display: flex;
    gap: raised.$padding;
}

text-entry-input-container {
    flex-grow: 1;
}

text-entry-input {
    @include raised.input;
    
    border-radius: raised.$padding;

    text-align: center;
}
</style>