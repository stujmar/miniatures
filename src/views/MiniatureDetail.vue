<template>
    <div v-if="miniature" class="space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-gray-900">{{ miniature.name }}</h2>
                <div class="mt-2 flex flex-wrap gap-2">
                    <span v-for="tag in miniature.tags" :key="tag"
                        class="px-2 py-1 text-sm bg-teal-50 text-teal-800 rounded-full">
                        {{ tag }}
                    </span>
                </div>
            </div>
            <div class="flex gap-2">
                <button @click="editMiniature" class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Edit
                </button>
                <button @click="handleDelete" class="btn bg-red-100 text-red-700 hover:bg-red-200">
                    Delete
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Image Section -->
            <div class="space-y-6">
                <div class="w-full aspect-square rounded-lg shadow-lg overflow-hidden">
                    <img v-if="miniature.image" :src="miniature.image" :alt="miniature.name"
                        class="w-full h-full object-cover" />
                    <MiniaturePlaceholder v-else class="w-full h-full" />
                </div>

                <!-- Paint Swatches -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Paints Used</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div v-for="paint in miniaturePaints" :key="paint.id"
                            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                            <div class="w-8 h-8 rounded-full border border-gray-200 shadow-sm shrink-0"
                                :style="{ backgroundColor: paint.color }"></div>
                            <div>
                                <p class="font-medium  text-sm text-gray-900">{{ paint.name }}</p>
                                <p class="text-sm text-gray-500">{{ paint.brand }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Details Section -->
            <div class="space-y-6">
                <!-- Notes -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Painting Notes</h3>
                    <p class="text-gray-600 whitespace-pre-line">{{ miniature.notes || 'No notes added yet.' }}</p>
                </div>

                <!-- Related Tutorials -->
                <div class="bg-white p-6 rounded-lg shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Related Tutorials</h3>
                    <div class="space-y-4">
                        <div v-for="tutorial in relatedTutorials" :key="tutorial.id"
                            class="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                            <h4 class="font-medium text-gray-900">{{ tutorial.title }}</h4>
                            <p class="text-sm text-gray-600 mt-1">{{ tutorial.description }}</p>
                            <a :href="tutorial.url" target="_blank" rel="noopener noreferrer"
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block">
                                Visit Tutorial →
                            </a>
                        </div>
                        <p v-if="!relatedTutorials.length" class="text-gray-500">
                            No related tutorials found.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Edit Modal -->
        <TransitionRoot appear :show="isEditModalOpen" as="template">
            <Dialog as="div" @close="closeModal" class="relative z-10">
                <TransitionChild enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                    leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-25" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                        <TransitionChild enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                                    Edit Miniature
                                </DialogTitle>

                                <form @submit.prevent="saveMiniature" class="mt-4 space-y-6">
                                    <div>
                                        <label for="miniature-name"
                                            class="block text-sm font-medium text-gray-700">Name</label>
                                        <input id="miniature-name" v-model="form.name" type="text" required
                                            class="input mt-1 text-gray-50" placeholder="Enter miniature name" />
                                    </div>

                                    <div>
                                        <label for="miniature-image"
                                            class="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                                        <input id="miniature-image" v-model="form.image" type="url"
                                            class="input mt-1 text-gray-50"
                                            placeholder="https://example.com/image.jpg" />
                                    </div>

                                    <div>
                                        <label for="miniature-notes"
                                            class="block text-sm font-medium text-gray-700">Notes</label>
                                        <textarea id="miniature-notes" v-model="form.notes" rows="3"
                                            class="input mt-1 text-gray-50"
                                            placeholder="Add painting notes, techniques used, etc."></textarea>
                                    </div>

                                    <!-- Paint Selection -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Paints Used</label>
                                        <div class="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                                            <button v-for="paint in store.paints" :key="paint.id" type="button"
                                                @click="togglePaint(paint.id)" :class="[
                                                    'block w-8 h-8 p-0 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
                                                    form.paints?.includes(paint.id)
                                                        ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 scale-110'
                                                        : 'border-gray-200 hover:scale-110'
                                                ]" :style="{ backgroundColor: paint.color }"
                                                :title="`${paint.brand} - ${paint.name}`">
                                                <span class="sr-only">{{ paint.brand }} - {{ paint.name }}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Tags -->
                                    <div>
                                        <label for="tag-input"
                                            class="block text-sm font-medium text-gray-700">Tags</label>
                                        <div class="mt-1 relative">
                                            <input id="tag-input" v-model="tagInput" @keydown.enter.prevent="addTag"
                                                type="text" class="input pr-10" placeholder="Add tag and press Enter" />
                                            <button type="button" @click="addTag"
                                                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="mt-2 flex flex-wrap gap-2">
                                            <span v-for="tag in form.tags" :key="tag"
                                                class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 group hover:bg-blue-200 transition-colors">
                                                {{ tag }}
                                                <button type="button" @click="removeTag(tag)"
                                                    class="ml-1.5 inline-flex p-1 items-center justify-center rounded-full bg-transparent text-blue-800 hover:bg-blue-300 transition-colors focus:outline-none focus:ring-0 border-0 hover:border-0 hover:border-transparent"
                                                    aria-label="Remove tag">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                        fill="currentColor" class="w-3 h-3">
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
                                            class="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button type="submit" class="btn btn-primary">
                                            Save Changes
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
    <div v-else class="text-center py-12">
        <p class="text-xl text-gray-600">Miniature not found.</p>
        <router-link to="/miniatures" class="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Miniatures
        </router-link>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useMiniatureStore } from '../stores/miniatures'
import MiniaturePlaceholder from '../components/MiniaturePlaceholder.vue'

const route = useRoute()
const router = useRouter()
const store = useMiniatureStore()

const miniature = computed(() => {
    return store.miniatures.find(m => m.id === Number(route.params.id))
})

const miniaturePaints = computed(() => {
    return (miniature.value?.paints || [])
        .map(paintId => store.paints.find(p => p.id === paintId))
        .filter(Boolean)
})

const relatedTutorials = computed(() => {
    if (!miniature.value?.tags?.length) return []
    return store.tutorials.filter(tutorial =>
        tutorial.tags.some(tag => miniature.value.tags.includes(tag))
    )
})

const isEditModalOpen = ref(false)
const tagInput = ref('')
const form = ref({
    name: '',
    image: '',
    notes: '',
    tags: [],
    paints: []
})

function editMiniature() {
    form.value = { ...miniature.value }
    isEditModalOpen.value = true
}

function closeModal() {
    isEditModalOpen.value = false
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

function saveMiniature() {
    store.updateMiniature(miniature.value.id, form.value)
    closeModal()
}

async function handleDelete() {
    if (confirm('Are you sure you want to delete this miniature?')) {
        store.deleteMiniature(miniature.value.id)
        router.push('/miniatures')
    }
}
</script>