import Vue from 'vue'
import Router from 'vue-router'
import state from '@/store/index'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const media = r => require.ensure([], () => r(require('@/page/media')), 'media');
const editNews = r => require.ensure([], () => r(require('@/page/news/editNews')), 'editNews');

const routes = [
	{
		path: '/login',
		component: login
	},
	{
		path: '/',
		component: manage,
		name: '',
		meta: {
			requireAuth: true  //需要登录的页面
		},
		children: [{
			path: '',
			component: home,
			meta: [],
		},{
			path:'/media',
			component:media,
			name: 'Media'
		},{
			path:'/editNews/:news',
			component:editNews,
			name: 'EditNews',
			props:true
		}]
	},
];
const router = new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
});
router.beforeEach((to, from, next) => {
	// console.info(22, window.location.href)
	//console.info(to,from,next)
	// 对路由变化作出响应...
	// console.log(router,to)
	// console.log(to)
	// console.log(to,$.param( to.query ),window.location.href)

	//全局拦截器的
	if (to.matched.some(r => r.meta.requireAuth)) {  // 判断该路由是否需要登录权限
		if (localStorage.adminInfo && JSON.parse(localStorage.adminInfo).Token) {  // 通过store获取当前的token是否存在
			next();
		} else {
			next({
				path: '/login'
			})
		}
	}
	else {
		next();
	}
})

export default router;
