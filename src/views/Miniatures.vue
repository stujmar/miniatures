<template>
  <div>
    <div class="flex justify-between items-center pb-4">
      <h2 class="text-2xl font-bold text-gray-900 font-heading">My Miniatures</h2>
      <button @click="isAddModalOpen = true" class="btn btn-primary">
        Add Miniature
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="flex gap-4 pb-4">
      <input v-model="searchQuery" type="text" placeholder="Search miniatures..." class="input flex-1 text-gray-50" />
      <select v-model="selectedTag" class="input w-48 text-gray-50">
        <option value="">All Tags</option>
        <option v-for="tag in availableTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>
    </div>

    <!-- Miniatures Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
      <router-link v-for="miniature in filteredMiniatures" :key="miniature.id" :to="`/miniatures/${miniature.id}`"
        class="group">
        <WhiteCard>
          <div>
            <div class="w-full h-48 rounded-t-lg overflow-hidden">
              <img v-if="miniature.image" :src="miniature.image" :alt="miniature.name"
                class="w-full h-full object-cover" />
              <MiniaturePlaceholder v-else class="w-full h-full" />
            </div>
            <div class="pt-4">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">{{
                miniature.name }}</h3>
              <div class="mt-2 h-8 flex items-center gap-2">
                <template v-for="(tag, index) in miniature.tags.slice(0, 2)" :key="tag">
                  <span class="px-2 py-1 text-sm bg-teal-50 text-teal-800 rounded-full">
                    {{ tag }}
                  </span>
                </template>
                <span v-if="miniature.tags.length > 2" class="px-2 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                  +{{ miniature.tags.length - 2 }}
                </span>
              </div>
              <!-- Add Paint Swatches -->
              <div class="mt-3 min-h-[60px]">
                <p class="text-sm text-gray-600 mb-1">Paints Used:</p>
                <div v-if="getMiniaturePaints(miniature).length > 0" class="flex flex-wrap gap-1">
                  <div v-for="paint in getMiniaturePaints(miniature)" :key="paint.id"
                    :style="{ backgroundColor: paint.color }" :title="`${paint.brand} - ${paint.name}`"
                    class="w-6 h-6 rounded-full border border-gray-200 shadow-sm cursor-help transition-transform hover:scale-110 relative">
                    <div
                      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 hover:opacity-100 pointer-events-none transition-opacity z-10"
                      :class="{ 'opacity-100': hover === paint.id }">
                      {{ paint.brand }} - {{ paint.name }}
                    </div>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-400 italic">No paints recorded</p>
              </div>
              <div class="mt-4 flex justify-end gap-2 h-8">
                <button @click.prevent="editMiniature(miniature)"
                  class="btn bg-gray-100 text-gray-700 hover:bg-gray-200 p-0 px-2 ">
                  Edit
                </button>
                <button @click.prevent="deleteMiniature(miniature.id)"
                  class="btn bg-red-100 text-red-700 hover:bg-red-200 p-0 px-2">
                  <TrashIcon size="5" />
                </button>
              </div>
            </div>
          </div>
        </WhiteCard>
      </router-link>
    </div>

    <!-- Add/Edit Modal -->
    <TransitionRoot appear :show="isAddModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                  {{ editingMiniature ? 'Edit' : 'Add' }} Miniature
                </DialogTitle>

                <form @submit.prevent="saveMiniature" class="mt-4 space-y-6">
                  <div>
                    <label for="miniature-name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input id="miniature-name" v-model="form.name" type="text" required class="input mt-1 text-gray-50"
                      placeholder="Enter miniature name" autocomplete="off" />
                  </div>

                  <div>
                    <label for="miniature-image" class="block text-sm font-medium text-gray-700">Image URL
                      (optional)</label>
                    <input id="miniature-image" v-model="form.image" type="url" class="input mt-1 text-gray-50"
                      placeholder="https://example.com/image.jpg" />
                  </div>

                  <div>
                    <label for="miniature-notes" class="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea id="miniature-notes" v-model="form.notes" rows="3" class="input mt-1 text-gray-50"
                      placeholder="Add painting notes, techniques used, etc."></textarea>
                  </div>

                  <!-- Paint Selection -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Paints Used</label>
                    <div class="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                      <button v-for="paint in store.paints" :key="paint.id" type="button" @click="togglePaint(paint.id)"
                        :class="[
                          'block w-8 h-8 p-0 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
                          form.paints?.includes(paint.id)
                            ? 'border-teal-500 ring-2 ring-teal-500 ring-offset-2 scale-110'
                            : 'border-gray-200 hover:scale-110'
                        ]" :style="{ backgroundColor: paint.color }" :title="`${paint.brand} - ${paint.name}`"
                        :aria-label="`Toggle ${paint.brand} - ${paint.name}`"
                        :aria-pressed="form.paints?.includes(paint.id)">
                        <span class="sr-only">{{ paint.brand }} - {{ paint.name }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div>
                    <label for="tag-input" class="block text-sm font-medium text-gray-700">Tags</label>
                    <div class="mt-1 relative">
                      <input id="tag-input" v-model="tagInput" @keydown.enter.prevent="addTag" type="text"
                        class="input pr-10" placeholder="Add tag and press Enter" aria-label="Add new tag" />
                      <button type="button" @click="addTag"
                        class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-900 hover:border-0 hover:text-gray-600 hover:bg-gray-400"
                        aria-label="Add tag">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    <!-- Tag List -->
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span v-for="tag in form.tags" :key="tag"
                        class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-800 group hover:bg-teal-200 transition-colors">
                        {{ tag }}
                        <button type="button" @click="removeTag(tag)"
                          class="ml-1.5 inline-flex p-1 items-center justify-center rounded-full bg-transparent text-teal-800 hover:bg-teal-300 transition-colors focus:outline-none focus:ring-0 border-0 hover:border-0 hover:border-transparent"
                          aria-label="Remove tag">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-3 h-3">
                            <path fill-rule="evenodd"
                              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                              clip-rule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end gap-3">
                    <button type="button" @click="closeModal"
                      class="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Cancel
                    </button>
                    <button type="submit"
                      class="btn btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {{ editingMiniature ? 'Save Changes' : 'Add Miniature' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useMiniatureStore } from '../stores/miniatures'
import WhiteCard from '../components/WhiteCard.vue'
import TrashIcon from '../components/icons/TrashIcon.vue'
import MiniaturePlaceholder from '../components/MiniaturePlaceholder.vue'

const store = useMiniatureStore()
const isAddModalOpen = ref(false)
const editingMiniature = ref(null)
const searchQuery = ref('')
const selectedTag = ref('')
const tagInput = ref('')
const hover = ref(null)

const form = ref({
  name: '',
  image: '',
  notes: '',
  tags: [],
  paints: []
})

const availableTags = computed(() => {
  const tags = new Set()
  store.miniatures.forEach(m => m.tags.forEach(tag => tags.add(tag)))
  return Array.from(tags)
})

const filteredMiniatures = computed(() => {
  return store.filteredMiniatures(searchQuery.value, selectedTag.value ? [selectedTag.value] : [])
})

function editMiniature(miniature) {
  editingMiniature.value = miniature
  form.value = { ...miniature }
  isAddModalOpen.value = true
}

function closeModal() {
  isAddModalOpen.value = false
  editingMiniature.value = null
  form.value = { name: '', image: '', notes: '', tags: [], paints: [] }
  tagInput.value = ''
}

function addTag() {
  if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
    form.value.tags.push(tagInput.value.trim())
  }
  tagInput.value = ''
}

function removeTag(tag) {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

function saveMiniature() {
  if (editingMiniature.value) {
    store.updateMiniature(editingMiniature.value.id, form.value)
  } else {
    store.addMiniature(form.value)
  }
  closeModal()
}

function deleteMiniature(id) {
  if (confirm('Are you sure you want to delete this miniature?')) {
    store.deleteMiniature(id)
  }
}

// Add this new function to get paint details for a miniature
function getMiniaturePaints(miniature) {
  return (miniature.paints || [])
    .map(paintId => store.paints.find(p => p.id === paintId))
    .filter(Boolean) // Remove any undefined values
}

// Add paint toggle function
function togglePaint(paintId) {
  if (!form.value.paints) {
    form.value.paints = []
  }
  const index = form.value.paints.indexOf(paintId)
  if (index === -1) {
    form.value.paints.push(paintId)
  } else {
    form.value.paints.splice(index, 1)
  }
}
</script>

<style scoped>
.rounded-full:hover>div {
  opacity: 1;
}
</style>