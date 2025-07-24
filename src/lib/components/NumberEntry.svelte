<script lang="ts">
import {TextInput} from "@vaie/hui";

let {
    value,
    onValueChange,
    placeholder = null,
    validate,
    disabled,
    id,
}: {
    value: number,
    onValueChange: (value: number) => void,
    placeholder?: string | null,
    validate?: (value: number) => boolean,
    disabled?: boolean,
    id?: string,
} = $props();
</script>

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


<style lang="scss">
number-entry-container {
    display: flex;
    gap: 0.5rem;
    
    border: 0.0625rem solid oklch(0.5 0.01 270);
    box-shadow: 0 0.0625rem 0.25rem oklch(0 0 0 / 0.3333333);

    border-radius: 0.5rem;
}

number-entry-input-container {
    flex-grow: 1;
}

number-entry-input {
    grid-area: 1/1;

    display: block;
    padding: 0.5rem;

    border-radius: 0.5rem 0 0 0.5rem;

    text-align: right;

    &.invalid {
        outline: 1px solid oklch(62.828% 0.20996 13.579);
        outline-offset: 0.5rem;
    }
}

label {
    padding: 0.5rem 0.5rem 0.5rem 0;
}
</style>