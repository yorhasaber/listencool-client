import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "li-container",
        component: () => import("@/views/LiContainer.vue"),
        children: [
            {
                path: "/",
                name: "home",
                component: home,
            }

        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
});



export default router
