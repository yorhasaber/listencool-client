import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import home from '@/views/Home.vue'

import songsheet from '@/views/song-sheet/SongSheet.vue'
import songsheetdetail from '@/views/song-sheet/SongSheetDetail.vue'
import lisinger from '@/views/singer/Singer.vue'
import SingerDetail from '@/views/singer/SingerDetail.vue'
import Lyric from '@/views/Lyric.vue'
import sign_in from '@/views/SignIn.vue'
import sign_up from '@/views/SignUp.vue'
import cs from '@/views/cs.vue'
import search from '@/views/search/Search.vue'
import setting from '@/views/setting/Setting.vue'
import personalData from '@/views/setting/PersonalData.vue'
import personal from '@/views/personal/Personal.vue'
import erro404 from '@/views/error/404.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: "/:pathMatch(.*)*",
        redirect: "/404",
    },
    {
        path: "/404",
        component: erro404,
    },
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
                path: "/sign-in",
                name: "sign-in",
                component: sign_in,
            },
            {
                path: "/sign-up",
                name: "sign-up",
                component: sign_up,
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
            {
                path: "/cs",
                name: "cs",
                component: cs,
            },
            {
                path: "/search",
                name: "search",
                component: search,
            },
            {
                path: "/personal",
                name: "personal",
                meta: {
                    requireAuth: true,
                },
                component: personal,
            },
            {
                path: "/setting",
                name: "setting",
                meta: {
                    requireAuth: true,
                },
                component: setting,
                children: [
                    {
                        path: "/setting/PersonalData",
                        name: "personalData",
                        meta: {
                            requireAuth: true,
                        },
                        component: personalData,
                    }
                ]
            },


        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
});



export default router
