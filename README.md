#### 前端页面组件模板
[https://github.com/PanJiaChen/vue-element-admin]

#### Build Setup
``` bash
# 解决 npm 安装 node-sass 速度慢的问题
1.配置淘宝的镜像
    npm config set registry https://registry.npm.taobao.org
2.然后在 ~/.npmrc 加入下面内容
    sass_binary_site=https://npm.taobao.org/mirrors/node-sass/

# 安装依赖
npm install

# 启动服务 localhost:8013
npm run dev

# 构建生产环境
npm run build:prod
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```