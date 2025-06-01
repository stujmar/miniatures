<template>
  <div class="space-y-6">
    <WhiteCard>
      <h2 class="text-2xl font-bold text-gray-900 font-heading">Welcome to your Miniatures Catalog</h2>
      <p class="mt-2 text-gray-600">Track your miniature painting projects, manage your paint collection, and save
        helpful tutorials.</p>
    </WhiteCard>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <router-link v-for="stat in stats" :key="stat.name" :to="stat.route" class="group">
        <WhiteCard class="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
          <dt class="text-sm font-medium text-gray-500 truncate group-hover:text-teal-600">{{ stat.name }}</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stat.value }}</dd>
        </WhiteCard>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMiniatureStore } from '../stores/miniatures'
import WhiteCard from '../components/WhiteCard.vue'

const store = useMiniatureStore()

const stats = computed(() => [
  { name: 'Total Miniatures', value: store.miniatures.length, route: '/miniatures' },
  { name: 'Paints Collection', value: store.paints.length, route: '/paints' },
  { name: 'Saved Tutorials', value: store.tutorials.length, route: '/tutorials' }
])
</script>