<script setup>
import PageLayout from './components/PageLayout.vue';
import RouteLayout from './components/RouteLayout.vue';
import { Disclosure, DisclosureButton, DisclosurePanel, Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Bars3Icon, XMarkIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import { useMiniatureStore } from './stores/miniatures';

const router = useRouter();
const route = useRoute();
const store = useMiniatureStore();
const isOpen = ref(false);
const isSaveModalOpen = ref(false);

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Miniatures', to: '/miniatures' },
  { name: 'Paints', to: '/paints' },
  { name: 'Tutorials', to: '/tutorials' }
];

const handleNavigation = (link, close) => {
  router.push(link.to);
  close();
};

const exportData = () => {
  const data = {
    miniatures: store.miniatures,
    paints: store.paints,
    tutorials: store.tutorials
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'miniatures-catalog-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const importData = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.miniatures) store.setMiniatures(data.miniatures);
        if (data.paints) store.setPaints(data.paints);
        if (data.tutorials) store.setTutorials(data.tutorials);
        isSaveModalOpen.value = false;
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Disclosure as="nav" class="bg-white shadow-sm w-full border-b border-gray-300" v-slot="{ open, close }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between h-16 w-full">
          <div class="flex w-full">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-900 font-heading">Miniatures Catalog</h1>
            </div>
            <!-- Desktop Navigation -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8 flex-1">
              <router-link v-for="link in navigation" :key="link.name" :to="link.to"
                class="inline-flex items-center px-1 pt-1 border-b-2" :class="[
                  route.name === link.name
                    ? 'border-teal-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]">
                <span class="hover:text-teal-500">{{ link.name }}</span>
              </router-link>
            </div>
            <!-- Save/Load Button (Desktop) -->
            <div class="hidden sm:flex items-center">
              <button @click="isSaveModalOpen = true"
                class="inline-flex items-center justify-center p-2 rounded-md bg-white text-gray-600 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
                <ArrowDownTrayIcon class="h-6 w-6" />
              </button>
            </div>
          </div>
          <!-- Mobile menu and save button -->
          <div class="flex items-center gap-2 sm:hidden">
            <!-- Save/Load Button (Mobile) -->
            <button @click="isSaveModalOpen = true"
              class="inline-flex items-center justify-center p-2 rounded-md bg-white text-gray-600 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
              <ArrowDownTrayIcon class="h-6 w-6" />
            </button>
            <DisclosureButton
              class="inline-flex items-center justify-center p-2 rounded-md bg-white text-gray-600 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500">
              <span class="sr-only">Open main menu</span>
              <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <!-- Mobile menu panel -->
      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 pb-3 pt-2">
          <div v-for="link in navigation" :key="link.name" @click="handleNavigation(link, close)" :class="[
            route.name === link.name
              ? 'bg-teal-50 border-teal-500 text-teal-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700',
            'block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer'
          ]">
            {{ link.name }}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <!-- Save/Load Modal -->
    <TransitionRoot appear :show="isSaveModalOpen" as="template">
      <Dialog as="div" @close="isSaveModalOpen = false" class="relative z-10">
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
                  Save/Load Data
                </DialogTitle>

                <div class="mt-4 space-y-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700">Export Data</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Download your catalog data as a JSON file.
                    </p>
                    <button @click="exportData"
                      class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                      <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
                      Export
                    </button>
                  </div>

                  <div class="border-t border-gray-200 pt-4">
                    <h3 class="text-sm font-medium text-gray-700">Import Data</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Upload a previously exported JSON file.
                    </p>
                    <label
                      class="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 cursor-pointer">
                      <ArrowUpTrayIcon class="h-5 w-5 mr-2" />
                      Import
                      <input type="file" class="hidden" accept=".json" @change="importData">
                    </label>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button @click="isSaveModalOpen = false"
                    class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <main class="py-6 w-full">
      <RouteLayout>
        <router-view></router-view>
      </RouteLayout>
    </main>
  </div>
</template>

<style>
/* Reset any max-width constraints from Vite's default styles */
#app {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>
