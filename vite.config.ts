import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver, NaiveUiResolver} from "unplugin-vue-components/resolvers";


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver(), NaiveUiResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },

    server: {
        https: false, //(使用https)启用 TLS + HTTP/2。注意：当 server.proxy 选项 也被使用时，将会仅使用 TLS
        host: true, // 监听所有地址
        port: 8888, //指定开发服务器端口：默认3000
        open: true, //启动时自动在浏览器中打开
        cors: false, //为开发服务器配置 CORS

        // hmr: {
        //   overlay: false
        // }
    },
    css: {

    },
})
