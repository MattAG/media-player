<template>
  <picker v-if="sources.length === 0"
          v-model:sources="sources" />
  <player v-else
          :sources="sources" />
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from '@vue/runtime-core';
import { onMounted, onUnmounted, ref } from 'vue';
import { Source } from './@types/source';

export default defineComponent({
    name: 'App',
    components: {
        Picker: defineAsyncComponent(() => import('./components/Picker.vue')),
        Player: defineAsyncComponent(() => import('./components/Player.vue'))
    },
    setup () {
        const sources = ref<Source[]>([]);

        function toggleContextMenu(event: Event) {
            event.preventDefault();
        }

        onMounted(() => {
            window.addEventListener('contextmenu', toggleContextMenu);
        });

        onUnmounted(() => {
            window.removeEventListener('contextmenu', toggleContextMenu);
        });

        return {
            sources
        };
    }
});
</script>
