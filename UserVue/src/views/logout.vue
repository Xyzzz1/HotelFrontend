<template>
    <div class="container">
        <el-button type="danger" @click="logout">退出登陆</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
        };
    },

    methods: {
        logout() {
            this.axios
                .get("http://localhost:9151/user/logout")
                .then((res) => {
                    console.log(res);
                    this.$router.push("/login");
                })
        },

    },
};
</script>

<style>
.container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    height: 50vh;
    /* 使容器高度为视窗高度 */
}</style>