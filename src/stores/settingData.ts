import {
    defineStore
} from 'pinia'

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

    },
    // 开启数据持久化
    persist: [{
        storage: localStorage,
    }]
})

export default useSettingDataStore

