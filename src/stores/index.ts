import {
    defineStore
} from 'pinia'

// @ts-ignore
import useSettingDataStore from "./settingData"

export const settingStore = () => useSettingDataStore()
