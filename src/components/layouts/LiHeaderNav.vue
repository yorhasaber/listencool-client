<template>
  <ul class="li-header-nav">
    <li :class="{ active: item.name === activeName }" v-for="item in styleList" :key="item.path" @click="handleChangeView(item)">
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  props: {
    styleList: Array,
    activeName: String,
  },
  emits: ["click"],
  setup() {
    const { proxy } = getCurrentInstance();

    function handleChangeView(item) {
      proxy.$emit("click", item.path, item.name);
    }
    return {
      handleChangeView,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

//li {
//  margin: $header-nav-margin;
//  padding: $header-nav-padding;
//  line-height: 3.3rem;
//  color: $color-grey;
//  border-bottom: none;
//  cursor: pointer;
//}
//
//li.active {
//  color: $color-black;
//  font-weight: 600;
//  border-bottom: 5px solid $color-black;
//}

.navigation-links {
  flex: 1;
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  user-select: none;

  li {
    -webkit-app-region: no-drag;
    font-size: 18px;
    font-weight: 700;
    text-decoration: none;
    border-radius: 6px;
    padding: 6px 10px;
    color: var(--color-text);
    transition: 0.2s;
    -webkit-user-drag: none;
    margin: {
      right: 12px;
      left: 12px;
    }

    &:hover {
      background: var(--color-secondary-bg-for-transparent);
    }

    &:active {
      transform: scale(0.92);
      transition: 0.2s;
    }
  }

  li.active {
    color: var(--color-primary);
  }
}
</style>
