<!--
 * @Description: 
 * @Author: Ruiqi Yu
 * @Date: 2024-04-24 14:47:11
-->
### 启动项目
``` bash
# 切换镜像
npm config set registry https://registry.npmmirror.com

# 安装依赖，对应node -v 16.13.2
npm install node-sass@6.0.1 --save-dev
npm install sass-loader@10.2.0 --save-dev
npm install

# 启动项目
npm run dev
