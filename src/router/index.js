import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/miniatures',
        name: 'Miniatures',
        component: () => import('../views/Miniatures.vue')
    },
    {
        path: '/paints',
        name: 'Paints',
        component: () => import('../views/Paints.vue')
    },
    {
        path: '/tutorials',
        name: 'Tutorials',
        component: () => import('../views/Tutorials.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 