declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "vue/types/vue" {
  import VueRouter, { Route } from "vue-router";

  interface Vue {
    $router: VueRouter;
    $route: Route;
  }
}

interface ResponseBody {
  code: string;
  success: boolean;
  message: string;
  type: string;
  data?: any;
}
