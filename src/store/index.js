import Vue from 'vue'
import Vuex from 'vuex'
import { postActionHandler } from '@/api/getData'

Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo) {
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({ commit }) {
		try {
			let adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
			if (adminInfo.Token) {
				let getInfoData = new FormData();
				getInfoData.append("Act", "User_GetInfo");
				getInfoData.append("Param", "{}");
				getInfoData.append("Verification", JSON.stringify({UserID:adminInfo.ID,Token:adminInfo.Token}));
				const res = await postActionHandler(getInfoData);
				if (res.Result) {
					commit('saveAdminInfo', res.Data);
				} else {
					throw new Error(res.Msg);
				}
				return res;
			} else {
				return { Result: false, Msg: '您尚未登陆或者session失效' };
			}
		} catch (err) {
			console.log('您尚未登陆或者session失效')
		}
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
})