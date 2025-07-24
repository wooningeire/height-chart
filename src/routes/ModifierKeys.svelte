<script lang="ts" module>
export class ModifierKeysState {
    alt = $state(false);
    ctrl = $state(false);
    shift = $state(false);
    meta = $state(false);
}

export const modifierKeys = new ModifierKeysState();

const updateModifierKeys = (event: KeyboardEvent) => {
    modifierKeys.alt = event.altKey;
    modifierKeys.ctrl = event.ctrlKey;
    modifierKeys.shift = event.shiftKey;
    modifierKeys.meta = event.metaKey;
};
</script>

<svelte:window
    onkeydown={updateModifierKeys}
    onkeyup={updateModifierKeys}
/>