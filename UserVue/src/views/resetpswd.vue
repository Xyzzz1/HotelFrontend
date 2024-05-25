<template>
    <div>
        <el-container class="wrapper">
            <el-main class="section text-center">
                <div class="resetpswd-bg"></div>
                <el-card class="resetpswd-card">
                    <div class="text">
                        <div style="margin-bottom: 15px;"></div>
                        <el-form :model="resetpswd" status-icon ref="resetpswd" label-width="80px">
                            <el-input type="text" v-model="resetpswd.phone" autocomplete="off" placeholder="电话号码"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="margin-bottom: 10px;"></div>
                            <el-input type="text" v-model="resetpswd.email" autocomplete="off" placeholder="密保邮箱"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="margin-bottom: 10px;"></div>
                            <el-input type="password" v-model="resetpswd.password" autocomplete="off" placeholder="新密码"
                                style="width: 20rem;height: 3rem;"></el-input>
                            <div style="margin-bottom: 10px;"></div>
                            <el-input type="password" v-model="resetpswd.reput_password" autocomplete="off"
                                placeholder="确认密码" style="width: 20rem;height: 3rem;"></el-input>
                        </el-form>
                        <el-button :type="btnType" @click="resetBtn" class="resetbtn" :disabled="disabled"
                            style="background-color: royalblue;">重置密码
                        </el-button>
                    </div>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>


<script>
import store from "./../store";
export default {
    data() {
        return {
            resetpswd: {
                phone: "",
                email: "",
                password: "",
                reput_password: "",
            },
            disabled: false,
            btnType: "primary",
            passwordsMatch: false,
        };
    },
    methods: {
        resetBtn() {
            if (
                this.resetpswd.phone.trim() == "" ||
                this.resetpswd.email.trim() == "" ||
                this.resetpswd.password.trim() == "" ||
                this.resetpswd.reput_password.trim() == ""
            ) {
                this.$message({
                    message: "输入不能为空",
                    type: "error",
                });
                return;
            }

            if(
                this.resetpswd.password.trim() !=
                this.resetpswd.reput_password.trim()
            )
            {
                this.$message({
                    message: "两次密码输入不相同",
                    type: "error",
                });
                return;
            }
            this.disabled = true;

            this.axios
                .post(process.env.VUE_APP_BASE_URL + "/user/resetpswd", {
                    phone: this.resetpswd.phone,
                    email: this.resetpswd.email,
                    password: this.resetpswd.password,
                })
                .then((res) => {
                    if (res.data.code == 200) {
                        this.btnType = "success";
                        this.$message({
                            message: "重置成功，正在登陆",
                            type: "success",
                        });
                        setTimeout(() => {
                            this.disabled = false;
                            this.$store.commit("setFind");
                            this.$router.push("/findroom");
                        }, 2000);
                    } else {
                        this.iconstyle = "el-icon-close";
                        this.btnType = "danger";
                        this.$message({
                            message: "登录失败，电话与密保邮箱不匹配",
                            type: "error",
                        });
                        setTimeout(() => {
                            this.disabled = false;
                            this.btnType = "primary";
                        }, 2000);
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
.resetpswd-bg {
    height: 30vh;
    background-size: 100%;
    border: 0px solid transparent;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.wrapper {
    width: 500px;
    margin: 0 auto;
    min-height: 90vh;
}
.resetpswd-card {
    margin: -7rem 3rem 1rem 3rem;
}

.text {
    font-size: 14px;
}

.resetbtn {
    width: 20rem;
    height: 2.5rem;
    font-size: 1rem;
    margin-top: 1rem;
}

</style>