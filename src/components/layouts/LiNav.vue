<template>
  <ul class="li-nav">
    <li v-for="(item, index) in styleList" :key="index" :class="{ active: item.name == activeName }" @click="handleChangeView(item)">
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

    function handleChangeView(val) {
      proxy.$emit("click", val);
    }
    return {
      handleChangeView,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/css/var.scss";

.li-nav {
  flex: 1;
  display: flex;

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

@media screen and (min-width: $sm) {
  .li-nav {
    li {
      margin: 0.5rem 1rem;
    }
  }
}

@media screen and (max-width: $sm) {
  .li-nav {
    li {
      margin: 0.3rem 0.4rem;
    }
  }
}
</style>
