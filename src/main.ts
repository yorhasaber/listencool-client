// @ts-ignore
// @ts-ignore
// @ts-ignore
import { createApp } from 'vue'
import ElementPlus from "element-plus";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue'
import { Store } from "vuex";
import router from"./router"
import store from "./store";
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import "element-plus/dist/index.css";
import "./assets/css/index.scss";
import "./assets/icons/index.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'




//import {State} from "@vue/runtime-core";


declare module "@vue/runtime-core" {
    interface State {
        count: number;
    }

    interface ComponentCustomProperties {
        $store: Store<State>;
    }
}

const app = createApp(App)
//全局注册elementplus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

//引入pina进行 使用 ，同时引入数据持久化插件
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router)
app.use(store)
app.use(ElementPlus);
app.mount('#app')
