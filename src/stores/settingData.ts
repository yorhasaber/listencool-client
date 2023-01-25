import {
    defineStore
} from 'pinia'
import {
    WbSunnyFilled,
    DarkModeFilled
} from "@vicons/material";
import {
    NIcon
} from "naive-ui";

const useSettingDataStore = defineStore('settingData', {
    state: () => {
        return {
            // 全局主题
            theme: "light",
            // 列表点击方式
            listClickMode: "dblclick",
            // 播放器样式
            playerStyle: "cover",
            // 是否显示歌词翻译
            showTransl: true,
            // 歌词位置
            lyricsPosition: "left",
            // 音乐频谱
            musicFrequency: false,
        }
    },
    getters: {
        // 获取明暗模式
        getSiteTheme(state) {
            return state.theme;
        },
        // 获取是否开启翻译
        getShowTransl(state) {
            return state.showTransl;
        },
    },
    actions: {
        // 切换明暗模式
        setSiteTheme(value) {
            // this.theme = value;
            // this.theme == "light" ? $message.info("已切换至浅色模式", {
            //     icon: () => h(NIcon, null, {
            //         default: () => h(WbSunnyFilled)
            //     }),
            // }) : $message.info("已切换至深色模式", {
            //     icon: () => h(NIcon, null, {
            //         default: () => h(DarkModeFilled)
            //     }),
            // })
        },

    },
    // 开启数据持久化
    persist: [{
        storage: localStorage,
    }]
})

export default useSettingDataStore

