<template>
    <div id="app">
      <el-container style="height: 100vh;">
        <el-aside width="200px" style="background-color: #545c64;">
          <!-- 侧边栏内容 -->
          <el-menu
            default-active="myroom"
            class="el-menu"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409EFF"
            router
          >
            <el-menu-item index="myroom">我的房间</el-menu-item>
            <el-menu-item index="conditioner">空调遥控</el-menu-item>
            <el-menu-item index="checkout">我要退房</el-menu-item>
            <el-menu-item index="other">other</el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header style="background-color: #409EFF; color: #fff; text-align: center;">头部</el-header>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'service',
  };
  </script>
  
  <style>
  /* 样式可根据需要自行调整 */
  .el-menu {
    height: 100%;
  }
  </style>
  