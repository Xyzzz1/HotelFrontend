<!--
 * @Description: 
 * @Author: Rusher
 * @Date: 2023-03-11 13:37:23
-->
<template>
    <div class="user-table">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="id"> </el-table-column>
            <el-table-column prop="userId" label="用户id"> </el-table-column>
            <el-table-column prop="roomId" label="房间id"> </el-table-column>
            <el-table-column prop="createTime" label="下单时间">
            </el-table-column>
            <el-table-column prop="inTime" label="入住时间"> </el-table-column>
            <el-table-column prop="leaveTime" label="预计离店时间">
            </el-table-column>
            <el-table-column prop="realPrice" label="预计价格">
            </el-table-column>
            <el-table-column prop="realPeople" label="入住人数">
            </el-table-column>
            <el-table-column label="发票">
                <template slot-scope="scope">
                    <span v-if="scope.row.fapiao == 1">需要</span>
                    <span v-if="scope.row.fapiao == 0">不需要</span>
                </template>
            </el-table-column>
            <el-table-column prop="flag" label="受理状态"> </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
                <template slot-scope="scope">
                    <el-button type="danger" @click="checkout(scope.row.userId)" style="font-size: 15px;">
                        退房</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="核对账单" :visible.sync="checkoutDiolog" width="25%">
            <el-card>
                <div class="text-left">
                    <p>用户id: {{ orderdata.userId }}</p>
                    <p>房间号: {{ orderdata.roomNumber }}</p>
                    <p>房间单价: {{ orderdata.price }} 元</p>
                    <p>入住时间: {{ orderdata.inTime }}</p>
                    <p>离店时间: {{ orderdata.realLeaveTime }}</p>
                    <p>房间总价: {{ orderdata.roomPrice }} 元</p>
                    <p>空调总价: {{ orderdata.conditionerPrice }} 元</p>
                    <div class="info-row">
                        <p>总价:</p>
                        <p class="room-price">{{ orderdata.totalPrice }} 元</p>
                    </div>
                </div>
            </el-card>
            <span slot="footer" class="dialog-footer">
                <div style="display: flex; justify-content: center;">
                    <el-button type="primary" @click="goto_specific_bill">查看详单</el-button>
                    <el-button type="danger" @click="get_pay">结账</el-button>
                </div>
            </span>
        </el-dialog>


        <el-dialog title="是否导出账单或详单？" :visible.sync="exportDiolog" width="35%">
            <span slot="footer" class="dialog-footer">
                <div style="display: flex; justify-content: center;">
                    <el-button type="primary" @click="get_bill_excel">导出账单</el-button>
                    <el-button type="primary" @click="get_conditioner_excel">导出空调账单</el-button>
                    <el-button type="primary" @click="get_specific_bill_excel">导出详单</el-button>
                    <el-button type="danger" @click="cancel">取消</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [],
            orderdata: {
            },
            userData: [],
            checkoutDiolog: false,
            exportDiolog: false,
        };
    },
    methods: {
        listOrders() {
            this.axios
                .get(process.env.VUE_APP_BASE_URL + "/reception/listOrders?orderFlags=1,2")
                .then((res) => {
                    this.tableData = res.data.data;
                    for (var i = 0; i < this.tableData.length; ++i) {
                        switch (this.tableData[i].flag) {
                            case 0:
                                this.tableData[i].flag = "未处理";
                                break;
                            case 1:
                                this.tableData[i].flag = "办理入住";
                                break;
                            case 2:
                                this.tableData[i].flag = "退订";
                                break;
                            case 3:
                                this.tableData[i].flag = "订单完成";
                                break;
                        }
                    }
                })
                .catch((res) => {
                    console.log("err: " + res);
                });
        },
        checkout(userID) {
            this.orderdata.userId=userID;
            this.axios
                .post(
                    process.env.VUE_APP_BASE_URL + "/reception/generateBill?userId=" +
                    userID
                )
                .then((res) => {
                    console.log(res.data);
                    this.orderdata.roomId = res.data.data.roomId;
                    this.orderdata.roomNumber = res.data.data.roomNumber;
                    this.orderdata.price = res.data.data.accommodationFee.unitPrice;
                    this.orderdata.inTime = res.data.data.accommodationFee.inTime;
                    this.orderdata.realLeaveTime = res.data.data.accommodationFee.leaveTime;
                    this.orderdata.roomPrice = res.data.data.accommodationFee.totalPrice;
                    this.orderdata.conditionerPrice = res.data.data.airConditionerFee.totalPrice;
                    this.orderdata.totalPrice = res.data.data.totalFee;
                    this.checkoutDiolog = true;
                })
                .catch((res) => {
                    console.log("err:" + res);
                });

        },
        goto_specific_bill() {
            console.log(this.orderdata.userId)
            this.$router.push({ path: `/specificBill/${this.orderdata.userId}` });
        },

        get_conditioner_excel() {
            this.axios
                .get(
                    process.env.VUE_APP_BASE_URL + "/reception/conditionerBillExcel?userId=" +
                    this.orderdata.userId, { responseType: 'blob' }
                )
                .then((response) => { 
                    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel; charset=utf-8' });
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = 'conditionerBill_'+this.orderdata.userId+'.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(downloadUrl);
                })
                .catch((error) => {
                    this.$message({
                            message: "下载失败!",
                            type: "error",
                        });
                });
        },
        get_bill_excel() {
            this.axios
                .get(
                    process.env.VUE_APP_BASE_URL + "/reception/billExcel?userId=" +
                    this.orderdata.userId, { responseType: 'blob' }
                )
                .then((response) => { 
                    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel; charset=utf-8' });
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = 'bill_'+this.orderdata.userId+'.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(downloadUrl);
                })
                .catch((error) => {
                    this.$message({
                            message: "下载失败!",
                            type: "error",
                        });
                });
        },
        get_specific_bill_excel() {
            this.axios
                .get(
                    process.env.VUE_APP_BASE_URL + "/reception/specificBillExcel?userId=" +
                    this.orderdata.userId, { responseType: 'blob' }
                )
                .then((response) => { 
                    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel; charset=utf-8' });
                    const downloadUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = 'specificBill_'+this.orderdata.userId+'.xlsx';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(downloadUrl);
                })
                .catch((error) => {
                    this.$message({
                            message: "下载失败!",
                            type: "error",
                        });
                });
        },


        get_pay() {
            this.axios
                .post(
                    process.env.VUE_APP_BASE_URL + "/reception/checkOut?roomId=" +
                    this.orderdata.roomId
                )
                .then((res) => {
                    if (res.data.code == "200") {
                        this.$message({
                            message: "结账成功!",
                            type: "success",
                        });
                    } else {
                        this.$message({
                            message: "结账失败!",
                            type: "error",
                        });
                    }
                });
            this.checkoutDiolog = false;
            this.exportDiolog = true;
        },



        cancel() {
            this.exportDiolog = false;
            window.location.reload();
        },

    },
    mounted() {
        this.listOrders();
    }

}
</script>

<style>
.text {
    font-size: 14px;
}

.item {
    padding: 15px 0 0 0;
}

.user-table {
    margin: 2rem;
}

.room-price {
    font-size: 1.5rem;
    color: #F56C6C;
}

.info-row {
    display: flex;
    align-items: center;
    /* 使内容垂直居中 */
}
</style>
