<template>
    <div>
        <div class="flex justify-between items-center pb-4">
            <h2 class="text-2xl font-bold text-gray-900 font-heading">Paint Collection</h2>
            <button @click="isAddModalOpen = true" class="btn btn-primary">
                Add Paint
            </button>
        </div>

        <!-- Search -->
        <input v-model="searchQuery" type="text" placeholder="Search paints..."
            class="input w-full mb-4 text-gray-50" />

        <!-- Paints List -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md w-full">
            <ul class="divide-y divide-gray-200 w-full">
                <li v-for="paint in filteredPaints" :key="paint.id" class="px-6 py-4 hover:bg-gray-50 w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center space-x-4">
                            <div class="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                                :style="{ backgroundColor: paint.color }"></div>
                            <div>
                                <h3 class="text-base font-medium text-gray-900">{{ paint.name }}</h3>
                                <p class="text-sm text-gray-500">{{ paint.brand }}</p>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button @click="editPaint(paint)" class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                                Edit
                            </button>
                            <button @click="deletePaint(paint.id)" class="btn bg-red-100 text-red-700 hover:bg-red-200">
                                <TrashIcon size="5" />
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
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
                                    {{ editingPaint ? 'Edit' : 'Add' }} Paint
                                </DialogTitle>

                                <form @submit.prevent="savePaint" class="mt-4 space-y-4 text-white-900">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Name</label>
                                        <input v-model="form.name" type="text" required
                                            class="input mt-1 text-gray-50" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Brand</label>
                                        <input v-model="form.brand" type="text" required
                                            class="input mt-1 text-gray-50" />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-700">Color</label>
                                        <input v-model="form.color" type="color" class="h-10 w-full rounded-md mt-1" />
                                    </div>

                                    <div class="mt-6 flex justify-end gap-3">
                                        <button type="button" @click="closeModal"
                                            class="btn bg-gray-100 text-gray-700 hover:bg-gray-200">
                                            Cancel
                                        </button>
                                        <button type="submit" class="btn btn-primary">
                                            {{ editingPaint ? 'Save Changes' : 'Add Paint' }}
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
import { useMiniatureStore } from '../stores/miniatures'
import TrashIcon from '../components/icons/TrashIcon.vue'
const store = useMiniatureStore()
const isAddModalOpen = ref(false)
const editingPaint = ref(null)
const searchQuery = ref('')

const form = ref({
    name: '',
    brand: '',
    color: '#000000'
})

const filteredPaints = computed(() => {
    const query = searchQuery.value.toLowerCase()
    return store.paints.filter(paint =>
        paint.name.toLowerCase().includes(query) ||
        paint.brand.toLowerCase().includes(query)
    )
})

function editPaint(paint) {
    editingPaint.value = paint
    form.value = { ...paint }
    isAddModalOpen.value = true
}

function closeModal() {
    isAddModalOpen.value = false
    editingPaint.value = null
    form.value = { name: '', brand: '', color: '#000000' }
}

function savePaint() {
    const paintData = {
        ...form.value,
        id: editingPaint.value?.id || Date.now()
    }

    if (editingPaint.value) {
        const index = store.paints.findIndex(p => p.id === editingPaint.value.id)
        if (index !== -1) {
            store.paints[index] = paintData
        }
    } else {
        store.addPaint(paintData)
    }
    closeModal()
}

function deletePaint(id) {
    if (confirm('Are you sure you want to delete this paint?')) {
        store.paints = store.paints.filter(p => p.id !== id)
    }
}
</script>