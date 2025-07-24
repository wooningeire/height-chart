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
@use "$lib/styles/raised.scss" as raised;

number-entry-container {
    display: flex;
    gap: raised.$raised-padding;

    @include raised.raised;
}

number-entry-input-container {
    flex-grow: 1;
}

number-entry-input {
    grid-area: 1/1;

    display: block;
    padding: raised.$raised-padding;

    border-radius: raised.$raised-padding 0 0 raised.$raised-padding;

    text-align: right;

    &.invalid {
        outline: 1px solid oklch(62.828% 0.20996 13.579);
        outline-offset: 0.5rem;
    }
}

label {
    padding: raised.$raised-padding raised.$raised-padding raised.$raised-padding 0;
}
</style>