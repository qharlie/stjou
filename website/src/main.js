import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterPrefetch from 'vue-router-prefetch'
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import router from './routes/router';
import i18n from './i18n';
import './registerServiceWorker'
import VCalendar from 'v-calendar';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import Vuex from 'vuex'
import VueUploadComponent from 'vue-upload-component'
Vue.use(Vuex)
import store from './store'
import log from './logger';
import VueGtag from "vue-gtag";

Vue.use(VueGtag, {
    config: { id: "G-YSXQ542PTJ" }
},router);

// dfd.NDframe.prototype.toJSON = function () {
//     return dfd.toJSON(this);
// }
// const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueRouter);
Vue.use(RouterPrefetch);
Vue.use(VCalendar, {
    componentPrefix: 'vc'
});
Vue.config.productionTip = false;
// Configuration VueAnalytics
// PropertyID: 361780220

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.prototype.$vueEventBus = new Vue();
//console.log(`App starting using VUE version ${Vue.version}`);


/* eslint-disable no-new */
new Vue({
    el: '#app',
    store: store,
    beforeCreate() {
        this.$store.commit('initialiseStore');
    },
    render: h => h(App),
    router,
    i18n
});


log.info('initialized main');
