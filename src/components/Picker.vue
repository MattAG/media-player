<template>
  <div class="bg-grey-100 flex items-center justify-center min-h-full min-w-full">
    <div class="bg-white flex flex-wrap mr-8 p-10 pt-8 shadow text-grey-900 w-80">
      <h3>
        Current Playlist
      </h3>

      <div v-for="(source, index) in currentSources"
           :key="index"
           class="border-b border-grey-200 mb-1 px-1 w-full">
        {{ source.src }}
      </div>
    </div>

    <form class="bg-white flex flex-wrap overflow-y-auto p-10 shadow w-80">
      <div class="flex flex-wrap mb-2 w-full">
        <div class="bg-emerald-500 mb-2 p-2 text-sm w-full">
          Enter a file path or URL, to add to the playlist.
        </div>

        <input v-model="source"
               class="mr-2 text-grey-800 w-2/3"
               type="text">

        <button class="bg-blue-500 flex-1"
                :disabled="!source"
                @click.prevent="addSource">
          Add
        </button>
      </div>

      <hr class="border-grey-200 mx-2 my-4 w-full">

      <button class="bg-green-500 w-full"
              :disabled="currentSources.length === 0"
              @click.prevent="completeSelection">
        Done
      </button>
    </form>
  </div>
</template>

<style scoped>
button,
input[type="text"] {
	@apply h-8;
}
</style>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Source } from '../@types/source';

export default defineComponent({
    name: 'Picker',
    props: {
        sources: {
            type: Array as () => Source[],
            required: true
        }
    },
    emits: {
        'update:sources': null
    },
    setup(props, { emit }) {
        const source = ref<string>('');
        const currentSources = ref<Source[]>([]);

        const sources = computed<Source[]>({
            get: () => props.sources,
            set: (value) => emit('update:sources', value)
        });

        function completeSelection() {
            sources.value = currentSources.value;
        }

        function addSource() {
            currentSources.value.push({
                src: source.value,
                tracks: []
            });

            source.value = '';
        }

        return {
            addSource,
            completeSelection,
            currentSources,
            source
        };
    }
});
</script>
