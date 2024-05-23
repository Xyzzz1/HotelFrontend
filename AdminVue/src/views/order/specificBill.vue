<template>
    <div class="user-table">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id"> </el-table-column>
            <el-table-column prop="userId" label="用户id"> </el-table-column>
            <el-table-column prop="roomId" label="房间id"> </el-table-column>
            <el-table-column prop="requestTime" label="请求时间"> </el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="windSpeed" label="风速"> </el-table-column>
            <el-table-column prop="temperature" label="温度">
            </el-table-column>
            <el-table-column prop="duration" label="使用时间(s)"></el-table-column>
            <el-table-column prop="reason" label="关机原因"></el-table-column>
            <el-table-column prop="extraFee" label="额外费用"></el-table-column>
            <el-table-column prop="currentFee" label="当前费用"></el-table-column>
            <el-table-column prop="feeRate" label="费率"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <div style="display: flex; justify-content: center;">
                <el-button type="danger" @click="back">返回</el-button>
            </div>
        </span>
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
        back() {
            window.history.back();
        },

    },

    mounted() {
        this.axios
            .get("http://localhost:9151/reception/specificBills?userId="+this.$route.params.userId)
            .then((res) => {
                console.log(res);
                this.tableData = res.data.data;
            })
            .catch((res) => {
                console.log("err:" + res);
            });

    },

};
</script>

<style></style>