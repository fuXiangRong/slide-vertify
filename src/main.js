// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

Vue.config.productionTip = false;
import slideVerify from "@elevenmonkey/slideverify";
import Antd from 'ant-design-vue'
// import Viser from 'viser-vue'
Vue.use(slideVerify)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
