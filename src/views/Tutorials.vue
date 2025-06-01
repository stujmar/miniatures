<template>
    <div>
        <div class="flex justify-between items-center pb-4">
            <h2 class="text-2xl font-bold text-gray-900 font-heading">Painting Tutorials</h2>
            <button @click="isAddModalOpen = true" class="btn btn-primary">
                Add Tutorial
            </button>
        </div>

        <!-- Search -->
        <input v-model="searchQuery" type="text" placeholder="Search tutorials..."
            class="input w-full mb-4 text-gray-50" />

        <!-- Tutorials Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
            <div v-for="tutorial in filteredTutorials" :key="tutorial.id" class="hover:shadow-lg transition-shadow">
                <WhiteCard>
                    <h3 class="text-lg font-semibold text-gray-900">{{ tutorial.title }}</h3>
                    <p class="mt-1 text-sm text-gray-500">{{ tutorial.description }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <span v-for="tag in tutorial.tags" :key="tag"
                            class="px-2 py-1 text-sm bg-teal-50 text-teal-800 rounded-full">
                            {{ tag }}
                        </span>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                        <a :href="tutorial.url" target="_blank" rel="noopener noreferrer"
                            class="text-teal-600 hover:text-teal-800 text-sm font-medium">
                            Visit Tutorial →
                        </a>
                        <div class="flex gap-2">
                            <button @click="editTutorial(tutorial)"
                                class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                                Edit
                            </button>
                            <button @click="deleteTutorial(tutorial.id)"
                                class="btn bg-red-100 text-red-700 hover:bg-red-200">
                                <TrashIcon size="5" />
                            </button>
                        </div>
                    </div>
                </WhiteCard>
            </div>
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
                            enter-to="opacity-100 scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
                                    {{ editingTutorial ? 'Edit' : 'Add' }} Tutorial
                                </DialogTitle>

                                <form @submit.prevent="saveTutorial" class="mt-4 space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Title</label>
                                        <input v-model="form.title" type="text" required class="input mt-1" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">URL</label>
                                        <input v-model="form.url" type="url" required class="input mt-1" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Description</label>
                                        <textarea v-model="form.description" rows="3" class="input mt-1"></textarea>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Tags</label>
                                        <input v-model="tagInput" @keydown.enter.prevent="addTag" type="text"
                                            placeholder="Add tag and press Enter" class="input mt-1" />
                                        <div class="mt-2 flex flex-wrap gap-2">
                                            <span v-for="tag in form.tags" :key="tag"
                                                class="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                                                {{ tag }}
                                                <button @click="removeTag(tag)" type="button"
                                                    class="text-blue-600 hover:text-blue-800">
                                                    ×
                                                </button>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mt-6 flex justify-end gap-3">
                                        <button type="button" @click="closeModal"
                                            class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                                            Cancel
                                        </button>
                                        <button type="submit" class="btn btn-primary">
                                            {{ editingTutorial ? 'Save Changes' : 'Add Tutorial' }}
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
import { useMiniatureStore } from '../stores/miniatures';
import WhiteCard from '../components/WhiteCard.vue';
import TrashIcon from '../components/icons/TrashIcon.vue';

const store = useMiniatureStore()
const isAddModalOpen = ref(false)
const editingTutorial = ref(null)
const searchQuery = ref('')
const tagInput = ref('')

const form = ref({
    title: '',
    url: '',
    description: '',
    tags: []
})

const filteredTutorials = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return store.tutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(query) ||
        tutorial.description.toLowerCase().includes(query) ||
        tutorial.tags.some(tag => tag.toLowerCase().includes(query))
    )
})

function editTutorial(tutorial) {
    editingTutorial.value = tutorial
    form.value = { ...tutorial }
    isAddModalOpen.value = true
}

function closeModal() {
    isAddModalOpen.value = false
    editingTutorial.value = null
    form.value = { title: '', url: '', description: '', tags: [] }
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

function saveTutorial() {
    const tutorialData = {
        ...form.value,
        id: editingTutorial.value?.id || Date.now()
    }

    if (editingTutorial.value) {
        const index = store.tutorials.findIndex(t => t.id === editingTutorial.value.id)
        if (index !== -1) {
            store.tutorials[index] = tutorialData
        }
    } else {
        store.addTutorial(tutorialData)
    }
    closeModal()
}

function deleteTutorial(id) {
    if (confirm('Are you sure you want to delete this tutorial?')) {
        store.tutorials = store.tutorials.filter(t => t.id !== id)
    }
}
</script>