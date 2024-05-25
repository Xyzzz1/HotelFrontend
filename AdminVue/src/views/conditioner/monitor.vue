<template>
    <div class="user-table">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="roomId" label="房间id"> </el-table-column>
            <el-table-column prop="userId" label="用户id"> </el-table-column>
            <el-table-column prop="powerOn" label="空调状态"> </el-table-column>
            <el-table-column prop="targetTemperature" label="设定温度"> </el-table-column>
            <el-table-column prop="windSpeed" label="设定风速"> </el-table-column>
            <el-table-column prop="requestTime" label="开机请求时间"></el-table-column>
            <el-table-column prop="powerOnTime" label="开机时间"> </el-table-column>
            <el-table-column prop="additionalFee" label="附加费用">
            </el-table-column>
            <el-table-column prop="targetDuration" label="使用时间(s)"></el-table-column>
            <el-table-column prop="mode" label="模式"></el-table-column>
            <el-table-column label="操作" width="210" fixed="right">
                <template slot-scope="scope">
                    <el-button type="success" @click="powerOn(scope.row.roomId)" style="font-size: 10px;">
                        开机</el-button>
                    <el-button type="danger" @click="powerOff(scope.row.roomId)" style="font-size: 10px;">
                        关机</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="height: 10px;"></div>
        <div class="button-container">
            <el-button type="primary" @click="logout()" style="font-size: 15px;">
                退出登陆
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],

        };
    },

    methods: {
        powerOn(roomID) {
            let json = {
                roomId: roomID,
                userId: null,
                on: true,
                targetTemperature: 25,
                windSpeed: 2,
                additionalFee: 0,
                targetDuration: -1,
                requestTime: this.changeTimeStr(new Date().toGMTString()),
                mode: 1
            }
            console.log(json);
            this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/turnOn", json)
                .then((res) => {
                    console.log(res.data);
                });
        },
        powerOff(roomID) {
            this.axios.post(process.env.VUE_APP_BASE_URL + "/user/conditioner/turnOff?roomId=" + roomID)
                .then((res) => {
                    if (res.data.code == '200') {
                        console.log(res.data.data);
                    }
                    else {
                        console.log(res.data.data);
                    }
                });
        },

        logout() {
            this.axios
                .get(process.env.VUE_APP_BASE_URL + "/admin/logout")
                .then((res) => {
                    this.$router.push(
                        `/`
                    );
                })
                .catch((res) => {
                    console.log("err: " + res);
                });
        },
        changeTimeStr(str) {
            str = str.toString();
            str = str.replace(/ GMT.+$/, ''); // Or str = str.substring(0, 24)
            let d = new Date(str);
            let a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
            for (var i = 0, len = a.length; i < len; i++) {
                if (a[i] < 10) {
                    a[i] = '0' + a[i];
                }
            }
            str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4];
            return str;
        },

    },

    mounted() {
        console.log(this.$route.params.userId);
        this.axios
            .get(process.env.VUE_APP_BASE_URL + "/admin/conditioner/listConditionerStatus")
            .then((res) => {
                console.log(res);
                this.tableData = res.data.data;
                for (var i = 0; i < this.tableData.length; ++i) {
                    if (this.tableData[i].targetDuration == -1) {
                        this.tableData[i].targetDuration = "未设定";
                    }
                    if (this.tableData[i].mode == 1) {
                        this.tableData[i].mode = "制冷";
                    }
                    else if (this.tableData[i].mode == 0) {
                        this.tableData[i].mode = "制热";
                    }
                    if (this.tableData[i].powerOn)
                        this.tableData[i].powerOn = "开机";
                    else
                        this.tableData[i].powerOn = "关机";

                }
                this.tableData = this.tableData.filter(item => item.roomID !== -1);
            })
            .catch((res) => {
                console.log("err:" + res);
            });

    },

};
</script>

<style>
.button-container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中，如果需要 */
    height: 100%;
    /* 根据需要调整高度 */
}
</style>