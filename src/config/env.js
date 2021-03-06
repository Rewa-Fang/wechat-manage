/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = ''; 
let routerMode = 'hash';
let baseImgPath;
let wxImageUrl = 'http://wechat.a2designing.cn/Handlers/MediaIdLocalImage.ashx?';

if (process.env.NODE_ENV == 'development') {
	baseUrl = '//wechat.a2designing.cn/handlers';
	baseImgPath = '//wechat.a2designing.cn/';
	wxImageUrl = '';
}else{
	baseUrl = '//wechat.a2designing.cn/handlers';
    baseImgPath = '//wechat.a2designing.cn/';
}

export {
	baseUrl,
	routerMode,
	baseImgPath,
	wxImageUrl
}