import { createApp } from "vue";
import App from "./dev.vue";
import { bucket } from "./store/index";

createApp(App)
    .use(bucket)
    .mount("#app");
