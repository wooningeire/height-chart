<script lang="ts">
import {TextInput} from "@vaie/hui";
    import EntryLabel from "./EntryLabel.svelte";

let {
    value,
    onValueChange,
    label = "",
    placeholder = null,
    validate,
    disabled,
    id,
}: {
    value: number,
    onValueChange: (value: number) => void,
    label?: string,
    placeholder?: string | null,
    validate?: (value: number) => boolean,
    disabled?: boolean,
    id?: string,
} = $props();
</script>


<number-entry-total-container>
    <EntryLabel {id}>{label}</EntryLabel>

    <number-entry-container>
        <TextInput
            value={value.toString()}
            onValueChange={value => onValueChange(Number(value))}
            placeholderText={placeholder ?? ""}
            validate={value => !isNaN(Number(value)) && (validate?.(Number(value)) ?? true)}
            {disabled}
        >
            {#snippet container({contents})}
                <number-entry-input-container>
                    {@render contents()}
                </number-entry-input-container>
            {/snippet}

            {#snippet input({localText, onLocalTextChange, el, onElChange, elProps, valid})}
                <number-entry-input
                    bind:this={() => el, onElChange}
                    bind:textContent={() => localText, onLocalTextChange}
                    {...elProps}
                    contenteditable
                    class:invalid={!valid}
                    {id}
                ></number-entry-input>
            {/snippet}
        </TextInput>

        <label for={id}>m</label>
    </number-entry-container>
</number-entry-total-container>


<style lang="scss">
@use "$/lib/client/styles/box.scss" as box;

number-entry-total-container {
    display: flex;
    flex-direction: column;
}

number-entry-container {
    @include box.depressed;

    display: flex;
    gap: box.$padding;
}

number-entry-input-container {
    flex-grow: 1;
}

number-entry-input {
    @include box.input;

    border-radius: box.$padding 0 0 box.$padding;

    text-align: right;
}

label {
    padding: box.$padding box.$padding box.$padding 0;
}
</style>