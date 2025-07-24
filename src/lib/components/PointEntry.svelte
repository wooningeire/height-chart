<script lang="ts">
import {TextInput} from "@vaie/hui";
import Separator from "./Separator.svelte";

let {
    x,
    y,
    onXChange,
    onYChange,
    disabled,
}: {
    x: number,
    y: number,
    onXChange: (x: number) => void,
    onYChange: (y: number) => void,
    disabled?: boolean,
} = $props();
</script>


<point-entries>
    <text-input-container>
        <TextInput
            value={x.toString()}
            onValueChange={value => onXChange(Number(value))}
            validate={value => !isNaN(Number(value))}
            {disabled}
            placeholderText="X"
        >
            {#snippet input({localText, onLocalTextChange, el, onElChange, elProps, valid})}
                <value-entry
                    bind:this={() => el, onElChange}
                    bind:textContent={() => localText, onLocalTextChange}
                    {...elProps}
                    contenteditable
                    class:invalid={!valid}
                    class="x"
                ></value-entry>
                px
            {/snippet}
        </TextInput>
    </text-input-container>

    <Separator />

    <text-input-container>
        <TextInput
            value={y.toString()}
            onValueChange={value => onYChange(Number(value))}
            validate={value => !isNaN(Number(value))}
            {disabled}
            placeholderText="Y"
        >
            {#snippet input({localText, onLocalTextChange, el, onElChange, elProps, valid})}
                <value-entry
                    bind:this={() => el, onElChange}
                    bind:textContent={() => localText, onLocalTextChange}
                    {...elProps}
                    contenteditable
                    class:invalid={!valid}
                    class="y"
                ></value-entry>
                px
            {/snippet}
        </TextInput>
    </text-input-container>
</point-entries>


<style lang="scss">
point-entries {
    display: flex;

    border: 0.0625rem solid oklch(0.5 0.01 270);
    box-shadow: 0 0.0625rem 0.25rem oklch(0 0 0 / 0.3333333);

    border-radius: 0.5rem;
}

text-input-container {
    display: flex;
    padding: 0.25rem 0.5rem;
    width: 6rem;
    overflow: hidden;
}


value-entry {
    grid-area: 1/1;

    width: 0;
    flex-grow: 1;

    &.x {
        border-radius: 0.5rem 0 0 0.5rem;
    }

    &.y {
        border-radius: 0 0.5rem 0.5rem 0;
    }
}
</style>