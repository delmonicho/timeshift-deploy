import Vue from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import FullCalendar from "vue-full-calendar";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import { ValidationProvider, extend, ValidationObserver } from "vee-validate";
//import * as VeeValidate from "vee-validate";
import { required } from "vee-validate/dist/rules";
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
extend("required", required);
// The root index.js file bootstraps the vue + vuex tutorial application by rendering
// the App component into the #app div element defined in the main index html file.
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
//Vue.use(VeeValidate);
Vue.use(FullCalendar);
Vue.use(BootstrapVue);
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
