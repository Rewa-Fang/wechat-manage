import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'babel-polyfill';
import SyncProgress from '@/plugin/syncProgress/syncProgress.js'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(SyncProgress);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
