import fetch from '@/config/fetch'

/**
 * 获取验证码code
 */

export const getCode = data => fetch('/CommonHandler.ashx', data, 'POST');

/**
 * 获取验证码图片
 */

export const getCodeImg = data => fetch('/VerificationCodeImg.ashx', data, 'GET');

/**
 * 登陆
 */

export const login = data => fetch('/ActionHandler.ashx', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/admin/singout');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/admin/info');


/**
 * 获取素材列表
 */

export const getMaterialList = data => fetch('/ActionHandler.ashx', data, 'POST');

export const deleteMateria = data => fetch('/ActionHandler.ashx', data, 'POST');

export const postActionHandler = data => fetch('/ActionHandler.ashx', data, 'POST');