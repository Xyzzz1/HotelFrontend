<template>
  <div>
    <el-switch
      v-model="isSwitchOn"
      active-color="#13ce66"
      inactive-color="#ff4949"
    ></el-switch>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSwitchOn: false // 默认关闭状态
    };
  }
};
</script>
