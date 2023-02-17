import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faR } from "@fortawesome/free-solid-svg-icons";

import App from "./App.vue";
import router from "./router";

// import "bootstrap/dist/css/bootstrap.css";
// import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import "./assets/style/global.css";
import "./assets/style/colors.css";

const app = createApp(App);

library.add(fas, faR);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);
app.use(router);
app.component("FontAwesome", FontAwesomeIcon);

// app.use(bootstrap);
app.mount("#app");
