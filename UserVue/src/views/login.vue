<template>
    <div>
        <el-container class="wrapper">
            <el-main class="section text-center">
                <div class="login-bg"></div>
                <el-card class="login-card">
                    <div class="item">
                        <img src="../assets/img/bupt.png" class="icon" style="width: 100px; height: 100px;">
                        <p class="login-title">
                            酒店用户登录
                        </p>
                        <el-form :model="login" status-icon ref="login" label-width="80px">
                            <el-input type="text" v-model="login.email" autocomplete="off" placeholder="电子邮箱"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="margin-bottom: 15px;"></div>
                            <el-input type="password" v-model="login.password" autocomplete="off" placeholder="密码"
                                style="width: 20rem;height: 3rem;"></el-input>
                        </el-form>
                        <el-button :type="btnType" @click="loginBtn" class="loginbtn" :disabled="disabled"
                            style="background-color: royalblue;">登陆
                        </el-button>
                    </div>
                    <div class="register">
                        <p>
                            遇到问题?    
                            <router-link to="/register" style="color: royalblue;">注册</router-link>
                            或
                            <router-link to="/resetpswd" style="color: royalblue;">重置密码</router-link>
                        </p>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import copyright from "@/components/copyright.vue";
import store from "./../store";
export default {
    data() {
        return {
            login: {
                email: "",
                password: "",
            },
            iconstyle: "iconfont icon-r-right",
            disabled: false,
            btnType: "primary",
            isRealLogin: true,
        };
    },
    components: {
        copyright,
    },
    methods: {
        loginBtn() {
            if (
                this.login.email.trim() == "" ||
                this.login.password.trim() == ""
            ) {
                this.$message({
                    message: "邮箱或密码不能为空",
                    type: "error",
                });
                return;
            }
            this.iconstyle = "el-icon-loading";
            this.disabled = true;

            this.axios
                .post("http://localhost:9151/user/login", {
                    email: this.login.email,
                    password: this.login.password,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        this.iconstyle = "el-icon-check";
                        this.btnType = "success";
                        this.$message({
                            message: "登录成功，正在跳转",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.disabled = false;
                            this.$store.commit("setFind");
                            this.$router.push("/service");
                        }, 1000);
                    } else {
                        this.iconstyle = "el-icon-close";
                        this.btnType = "danger";
                        this.$message({
                            message: "登录失败，账号或密码错误",
                            type: "error",
                        });
                        setTimeout(() => {
                            this.disabled = false;
                            this.iconstyle = "iconfont icon-r-right";
                            this.btnType = "primary";
                        }, 1000);
                    }
                })
                .catch((e) => {
                    this.iconstyle = "el-icon-close";
                    this.btnType = "danger";
                    setTimeout(() => {
                        this.disabled = false;
                        this.iconstyle = "iconfont icon-r-right";
                        this.btnType = "primary";
                    }, 2000);

                    if (e.response == undefined || e.response.data == undefined) {
                        this.$message({
                            showClose: true,
                            message: e,
                            type: "error",
                            duration: 0,
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: e.response.data,
                            type: "error",
                            duration: 0,
                        });
                    }
                });
        },
        nologinBtn() {
            this.$store.commit("setFind");
            this.$router.push("/findroom");
        },
    },
};
</script>

<style scoped="scoped">
.login-bg {
    height: 30vh;
    background-size: 100%;
    border: 0px solid transparent;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.text {
    font-size: 14px;
}
.login-card {
    margin: -7rem 3rem 1rem 3rem;
}

.login-title {
    font-size: 1.5rem;
    margin-top: 1rem;
}

.wrapper {
    width: 500px;
    margin: 0 auto;
    min-height: 90vh;
}

.el-main {
    max-height: 90vh;
}

#app {
    overflow: hidden;
}

.loginbtn {
    width: 20rem;
    height: 2.5rem;
    font-size: 1rem;
    margin-top: 1rem;
}

.register {
    margin-top: 5vh;
}

.changepwd {
    margin-top: 0vh;
}

.register a,
.register div {
    color: #fff;
}

.register p {
    margin: 1rem;
}
</style>
