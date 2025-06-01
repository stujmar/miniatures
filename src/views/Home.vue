<template>
  <div class="space-y-6">
    <WhiteCard>
      <h2 class="text-2xl font-bold text-gray-900 font-heading">Welcome to your Miniatures Catalog</h2>
        <p class="mt-2 text-gray-600">Track your miniature painting projects, manage your paint collection, and save
          helpful tutorials.</p>
      </WhiteCard>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="stat in stats" :key="stat.name">
        <WhiteCard>
          <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.name }}</dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ stat.value }}</dd>
        </WhiteCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMiniatureStore } from '../stores/miniatures'
import WhiteCard from '../components/WhiteCard.vue'

const store = useMiniatureStore()

const stats = computed(() => [
  { name: 'Total Miniatures', value: store.miniatures.length },
  { name: 'Paints Collection', value: store.paints.length },
  { name: 'Saved Tutorials', value: store.tutorials.length }
])
</script>