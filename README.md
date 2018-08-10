### 解决IE兼容的问题
陇共分三步：  


1.首先安装 babel-polyfill   

    npm install babel-polyfill

2.然后修改 webpack 配置入口文件

在vue-cli 生成的项目中  修改的是webpack.base.conf.js 这个文件   

将：  

    entry: {
      app: './src/main.js'
    },  

改为：   

    entry: {  
      entry: ['babel-polyfill', './src/main.js']  
    },
 
3.在 main.js 中引用 babel-polyfill  

    import 'babel-polyfill';  


### 解决FormData 格式请求获取不到的问题.   

用formData格式发送请求时， 不需要设置请求头Content-type。  
设置请求头反而会导致错误 。 


