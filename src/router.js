import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Miniatures from './views/Miniatures.vue'
import MiniatureDetail from './views/MiniatureDetail.vue'
import Paints from './views/Paints.vue'
import Tutorials from './views/Tutorials.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/miniatures',
        name: 'Miniatures',
        component: Miniatures
    },
    {
        path: '/miniatures/:id',
        name: 'MiniatureDetail',
        component: MiniatureDetail
    },
    {
        path: '/paints',
        name: 'Paints',
        component: Paints
    },
    {
        path: '/tutorials',
        name: 'Tutorials',
        component: Tutorials
    },
    // Catch-all route for S3 hosting
    {
        path: '/:pathMatch(.*)*',
        redirect: '/home'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 