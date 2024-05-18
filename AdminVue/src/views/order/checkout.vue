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
            <el-table-column prop="realPrice" label="总计价格">
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
                    <el-button type="danger" @click="checkout(scope.row.userId, scope.row.roomId,scope.row.inTime)"
                        style="font-size: 15px;">
                        结账</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="核对账单" :visible.sync="checkoutDiolog" width="25%">
            <el-card>
                <div class="text-left">
                    <p>用户名: {{ orderdata.username }}</p>
                    <p>手机号码: {{ orderdata.phone }}</p>
                    <p>房间号: {{ orderdata.roomNumber }}</p>
                    <p>房间类型: {{ orderdata.type }}</p>
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
                    <el-button type="primary" @click="get_specific_bill">出示详单</el-button>
                    <el-button type="danger" @click="get_pay">用户缴费</el-button>
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
        };
    },
    methods: {
        listOrders() {
            this.axios
                .get("http://localhost:9151/admin/listOrders?orderFlags=1,2,3")
                .then((res) => {
                    console.log(res.data.data);
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
        checkout(userID, roomID,inTime) {
            for (var i = 0; i < this.userData.length; i++) {
                if (this.userData[i].id == userID) {
                    this.orderdata.username = this.userData[i].userName;
                    this.orderdata.phone = this.userData[i].phone;
                    this.orderdata.userID = userID;
                    break;
                }
            };
            this.axios
                .post(
                    "http://localhost:9151/admin/roomDetail?roomId=" +
                    roomID
                )
                .then((res) => {
                    this.orderdata.roomNumber = res.data.data.room.number;
                    this.orderdata.type = res.data.data.type.typeName;
                    this.orderdata.price = res.data.data.type.price;
                    this.orderdata.inTime=inTime;
                    this.orderdata.realLeaveTime=this.changeTimeStr(new Date());
                    this.orderdata.roomPrice = this.calcPrice(inTime, this.orderdata.realLeaveTime,this.orderdata.price);
                    this.orderdata.conditionerPrice = 12.5;
                    this.orderdata.totalPrice=this.orderdata.roomPrice+this.orderdata.conditionerPrice;
                    this.checkoutDiolog = true;
                })
                .catch((res) => {
                    console.log("err:" + res);
                });

        },
        get_specific_bill() {
            this.$router.push({ path: `/specificBill/${this.orderdata.userID}` });
        },
        get_pay(){

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
        calcPrice(indate,leavedate,price) {
			let stra = this.changeTimeStr(leavedate);
			let sa1 = stra.split(" ")[0].split("-");
			let sa2 = stra.split(" ")[1].split(":");
			let leaveTime = new Date();
			leaveTime.setFullYear(sa1[0], sa1[1], sa1[2]);
			leaveTime.setHours(sa2[0]);
			leaveTime.setMinutes(sa2[1]);
			let strb = this.changeTimeStr(indate);
            let sumprice=0;
			if (strb > stra) {
				sumprice = '--';
				return;
			}
			let sb1 = strb.split(" ")[0].split("-");
			let sb2 = strb.split(" ")[1].split(":");
			let inTime = new Date();
			inTime.setFullYear(sb1[0], sb1[1], sb1[2]);
			inTime.setHours(sb2[0]);
			inTime.setMinutes(sb2[1]);
			let realday = (leaveTime - inTime) / 86400000;
			// console.log(Math.ceil(realday));
			realday = Math.ceil(realday);
			sumprice = price * realday;
			if (isNaN(sumprice)) {
				sumprice = '--';
			}
            return sumprice;
			//console.log("单价: " + price + " 时长: " + realday + " 总价: " + this.sumprice);
			// console.log(this.bookstat.leaveTime,this.bookstat.inTime,this.bookstat.leaveTime - this.bookstat.inTime);
		},
    },
    mounted() {
        this.axios
            .get("http://localhost:9151/admin/listUsers")
            .then((res) => {
                //console.log(res.data.data);
                this.userData = res.data.data;
                for (var i = 0; i < this.userData.length; i++) {
                    // 性别
                    if (this.userData[i].sex == 0) {
                        this.userData[i].sex = "女";
                    } else if (this.userData[i].sex == 1) {
                        this.userData[i].sex = "男";
                    }

                    // 状态
                    if (this.userData[i].state == 0) {
                        this.userData[i].state = "游客";
                    } else if (this.userData[i].state == 1) {
                        this.userData[i].state = "会员";
                    }
                }
            })
            .catch((res) => {
                console.log("err:" + res);
            });
        this.listOrders();
    },
};
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
  align-items: center; /* 使内容垂直居中 */
}
</style>
