import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faR } from "@fortawesome/free-solid-svg-icons";
// import { useRouter } from "vue-router";

import App from "./App.vue";
import "./assets/style/global.css";
import "./assets/style/variables.css";
import router from "./router";

const app = createApp(App);

// const router = useRouter();
library.add(fas, faR);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);
app.use(router);
app.component("FontAwesome", FontAwesomeIcon);
app.mount("#app");
