<template>
    <div class="user-table">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="roomID" label="房间id"> </el-table-column>
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
                    <el-button type="success" @click="powerOn(scope.row.roomID)" style="font-size: 10px;">
                        开机</el-button>
                    <el-button type="danger" @click="powerOff(scope.row.roomID)" style="font-size: 10px;">
                        关机</el-button>
                </template>
            </el-table-column>
        </el-table>
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

        },
        powerOff(roomID) {
        },

    },

    mounted() {
        console.log(this.$route.params.userId);
        this.axios
            .get("http://localhost:9151/admin/conditioner/listConditionerStatus")
            .then((res) => {
                console.log(res);
                this.tableData = res.data.data;
                let isService = true;
                for (var i = 0; i < this.tableData.length; ++i) {
                    if (this.tableData[i].roomID == -1) {
                        isService = false;
                    }
                    if (this.tableData[i].targetDuration == -1) {
                        this.tableData[i].targetDuration = "未设定";
                    }
                    if (this.tableData[i].mode == 1) {
                        this.tableData[i].mode = "制冷";
                    }
                    else if(this.tableData[i].mode ==0){
                        this.tableData[i].mode = "制热";
                    }
                    if (this.tableData[i].powerOn) {
                        if (isService)
                            this.tableData[i].powerOn = "开机";
                        else
                            this.tableData[i].powerOn = "等待";
                    } else {
                        this.tableData[i].powerOn = "关机";
                    }
                }
                this.tableData = this.tableData.filter(item => item.roomID !== -1);
            })
            .catch((res) => {
                console.log("err:" + res);
            });

    },

};
</script>

<style></style>