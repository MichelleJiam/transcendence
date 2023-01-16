import { createApp } from "vue";
import { createPinia } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faR } from "@fortawesome/free-solid-svg-icons";

import App from "./App.vue";
import router from "./router";

// import "bootstrap/dist/css/bootstrap.css";
// import bootstrap from "bootstrap/dist/js/bootstrap.bundle.js";
import "./assets/global.css";

const app = createApp(App);

library.add(fas, faR);

app.use(createPinia());
app.use(router);
app.component("FontAwesome", FontAwesomeIcon);
// app.use(bootstrap);

app.mount("#app");
