import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import home from '@/views/Home.vue'

import songsheet from '@/views/song-sheet/SongSheet.vue'
import songsheetdetail from '@/views/song-sheet/SongSheetDetail.vue'

import lisinger from '@/views/singer/Singer.vue'
import SingerDetail from '@/views/singer/SingerDetail.vue'
import Lyric from '@/views/Lyric.vue'

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
            },
            {
                path: "/song-sheet",
                name: "song-sheet",
                component: songsheet,
            },
            {
                path: "/song-sheet-detail/:id",
                name: "song-sheet-detail",
                component: songsheetdetail,
            },
            {
                path: "/singer",
                name: "singer",
                component: lisinger,
            },
            {
                path: "/singer-detail/:id",
                name: "singer-detail",
                component: SingerDetail,
            },
            {
                path: "/lyric/:id",
                name: "lyric",
                component: Lyric,
            },


        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
});



export default router
