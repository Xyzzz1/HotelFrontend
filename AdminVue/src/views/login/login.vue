<template>
    <div>
        <el-container class="wrapper">
            <el-main class="section text-center">
                <div class="login-bg"></div>
                <el-card class="login-card">
                    <div class="item">
                        <img src="../../assets/bupt.png" class="icon" style="width: 100px; height: 100px;">
                        <p class="login-title">
                            酒店工作人员登录
                        </p>
                        <el-form :model="login" status-icon ref="login" label-width="80px">
                            <el-input type="text" v-model="login.email" autocomplete="off" placeholder="电子邮箱"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="margin-bottom: 15px;"></div>
                            <el-input type="password" v-model="login.password" autocomplete="off" placeholder="密码"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="height: 20px;"></div>
                            <el-radio-group v-model="login.type">
                                <el-radio :label="1" class="radio-button">前台</el-radio>
                                <el-radio :label="0" class="radio-button">空调管理员</el-radio>
                            </el-radio-group>
                        </el-form>
                        <el-button :type="btnType" @click="loginBtn" class="loginbtn" :disabled="disabled"
                            style="background-color: royalblue;">登陆
                        </el-button>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            login: {
                email: "",
                password: "",
                type: 1,
            },
            disabled: false,
            btnType: "primary",
            isRealLogin: true,
            url_type: "",
        };
    },

    methods: {
        loginBtn() {
            if (
                this.login.email.trim() == "" ||
                this.login.password.trim() == ""
            ) {
                this.$message({
                    message: "账号或密码不能为空",
                    type: "error",
                });
                return;
            }
            this.iconstyle = "el-icon-loading";
            this.disabled = true;


            if (this.login.type == 1)
                this.url_type = "reception";
            else
                this.url_type = "admin";

            this.axios
                .post(process.env.VUE_APP_BASE_URL + "/" + this.url_type + "/login", {
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
                            if (this.login.type == 1)
                                this.$router.push("/index");
                            else
                                this.$router.push("/conditioner");
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

.radio-button {
    margin-right: 20px;
    margin-left: 20px;
}
</style>
