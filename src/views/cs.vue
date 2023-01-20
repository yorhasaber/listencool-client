<template>
  <body>

  <div>
    <KeyboardArrowUpFilled/>

    <n-icon title="上一曲" class="prev" size="30" :component="KeyboardArrowUpFilled" @click="prev"/>
  </div>



  </body>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {
  KeyboardArrowUpFilled,
  MusicNoteFilled,
  PlayCircleFilled,
  PauseCircleFilled,
  SkipNextRound,
  SkipPreviousRound,
  PlaylistPlayRound,
  VolumeOffRound,
  VolumeMuteRound,
  VolumeDownRound,
  VolumeUpRound,
  RepeatRound,
  RepeatOneRound,
  ThumbDownRound,
  FavoriteBorderRound,
} from "@vicons/material";

export default defineComponent({
  setup() {
    return {
      KeyboardArrowUpFilled,
    }
  },
  components: {
    KeyboardArrowUpFilled,
  }
})
</script>

<style scoped>


</style>
