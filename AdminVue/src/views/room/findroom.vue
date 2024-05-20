<template>
	<div>
		<el-container class="wrapper">
			<!-- <el-header class="header">找房</el-header> -->
			<el-main class="section">
				<el-card class="box-card" style="opacity: 1; width: 92rem; margin-left: 50px;">
					<div class="text item" style="margin-bottom: 20px;">
						<el-form ref="form" :model="form">
							<el-row :gutter="10">
								<el-col :span="3.5">
									<div>
										<el-form-item class="label-text" label="入住时间 *">
											<el-date-picker type="datetime" placeholder="选择日期"
												v-model="form.indate"></el-date-picker>

										</el-form-item>
									</div>
								</el-col>
								<el-col :span="3.5">
									<div>
										<el-form-item class="label-text" label="离店时间 *">
											<el-date-picker type="datetime" placeholder="选择日期"
												v-model="form.leavedate"></el-date-picker>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="4">
									<div>
										<el-form-item class="label-text" label="客房类型">
											<el-select v-model="form.selectedType" placeholder="请选择客房类型">
												<el-option v-for="(type, index) in roomtype" :key="index" :label="type"
													:value="type"></el-option>
											</el-select>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="3.5">
									<div>
										<el-form-item class="label-text" label="住店人数">
											<el-input-number v-model="form.max_people" :min="1" :max="99"
												:style="{ width: '160px' }"></el-input-number>
											<span style="margin-left: 5px;">人</span>
										</el-form-item>
									</div>
								</el-col>
								<el-col :span="5">
									<div>
										<el-form-item class="label-text" label="价格区间">
											<el-input v-model="form.min_price" placeholder="最低价"
												:style="{ width: '100px' }"></el-input>
											<span style="margin-left: 5px;">-</span>
											<el-input v-model="form.max_price" placeholder="最高价"
												:style="{ width: '100px' }"></el-input>
											<span style="margin-left: 5px;">元</span>
										</el-form-item>
									</div>
								</el-col>
								<div class="text item">
									<el-button type="primary"
										style="font-size: 16px; position: absolute; top: 32px; right: 50px;"
										@click="searchBtn">查询空余房间</el-button>
								</div>

							</el-row>
						</el-form>
					</div>
				</el-card>
				<div class="container">
					<h2 style="text-align: left; margin-left:70px;">{{ heading }}</h2>
					<el-row class="mt-1">
						<el-col :span="10" v-for="(tp, index) in paginatedList" :key="index" :offset="1" class="mb-1">
							<div @click="openDialog(tp)" style="cursor: pointer;">
								<el-card :body-style="{ padding: '0px' }">
									<el-row>
										<el-col :span="6">
											<img :src="tp.type.coverImage" class="image">
										</el-col>
										<el-col :span="18">
											<div style="padding: 12px;" class="text-left room">
												<!-- :href="tp.detailUrl"  -->
												<p class="room-title">
													{{ tp.type.typeName }}-{{ tp.number }}
												</p>
												<p class="room-intro">{{ tp.introduce }}</p>
												<p class="room-price">￥{{ tp.type.price }}</p>
												<p class="room-comment">{{ tp.introduces.面积 }}，可容纳{{ tp.introduces.容纳 }}<br>
													WIFI: {{ tp.introduces.WIFI }}<br>早餐: {{ tp.introduces.早餐 }}<br>热水:
													{{ tp.introduces.热水 }}<br>
													电脑: {{ tp.introduces.电脑 }}<br>电视: {{ tp.introduces.电视 }}</p>
											</div>
										</el-col>
									</el-row>
								</el-card>
							</div>
						</el-col>
					</el-row>
					<div class="pagination-container">
						<el-pagination v-model="currentPage" :total="listdata.length" :page-size="pageSize"
							layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange">
						</el-pagination>
					</div>
				</div>
			</el-main>
			<el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
				<span style="font-size: 16px;">{{ warning }}</span>
				<span slot="footer" class="dialog-footer">
					<div style="display: flex; justify-content: center;">
						<el-button type="primary" @click="dialogVisible = false">确定</el-button>
					</div>
				</span>
			</el-dialog>
			<el-dialog title="房间预定" :visible.sync="bookDialogVisible" width="30%">
				<el-card>
					<el-row>
						<el-col :span="6">
							<img :src="bookRoom.type.coverImage" class="book-image">
						</el-col>
						<el-col :span="18">
							<div style="padding: 12px;" class="text-right room">
								<!-- :href="tp.detailUrl"  -->
								<p class="room-title">
									{{ bookRoom.type.typeName }}-{{ bookRoom.number }}
								</p>
								<p class="room-intro">{{ bookRoom.introduce }}</p>
								<p class="room-price">￥{{ bookRoom.type.price }}</p>
								<p class="room-comment">{{ bookRoom.introduces.面积 }}，可容纳{{ bookRoom.introduces.容纳 }}<br>
									WIFI: {{ bookRoom.introduces.WIFI }}<br>早餐: {{ bookRoom.introduces.早餐 }}<br>热水:
									{{ bookRoom.introduces.热水 }}<br>
									电脑: {{ bookRoom.introduces.电脑 }}<br>电视: {{ bookRoom.introduces.电视 }}</p>
							</div>
						</el-col>
					</el-row>
					<el-form ref="form" :model="form">
						<el-row>
							<el-form-item label="入住时间" label-width="100px">
								<el-date-picker type="datetime" placeholder="选择日期" v-model="form.indate"></el-date-picker>

							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="离店时间" label-width="100px">
								<el-date-picker type="datetime" placeholder="选择日期"
									v-model="form.leavedate"></el-date-picker>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="住店人数" label-width="100px">
								<el-input-number v-model="form.max_people" :min="1" :max="99"
									:style="{ width: '160px' }"></el-input-number>
								<span style="margin-left: 5px;">人</span>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="提供发票" label-width="100px">
								<el-switch v-model="form.isNeedInvoice"></el-switch>
							</el-form-item>
						</el-row>
						<el-row>
							<el-form-item label="房间总价" label-width="100px">
								<span class="room-price">{{ sumprice }} 元</span>
							</el-form-item>
						</el-row>
					</el-form>
				</el-card>
				<span slot="footer" class="dialog-footer">
					<div style="display: flex; justify-content: center;">
						<el-button type="primary" @click="confirmSubmitForm">预定</el-button>
						<el-button type="danger"
							@click="bookDialogVisible = false, form.isNeedInvoice = false">取消</el-button>
					</div>
				</span>
			</el-dialog>
		</el-container>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isLoggedIn: false,
			username: '',
			bookstat: {},
			roomNumber: "",
			dialogVisible: false,
			bookDialogVisible: false,
			sumprice: '',
			form: {
				indate: '',
				leavedate: '',
				currentDate: new Date(),
				selectedType: "",
				max_people: 0,
				min_price: '',
				max_price: '',
				isNeedInvoice: 0,
			},
			heading: '当前所有空闲房间',
			warning: '',
			bookRoom: {
				id: 1,
				introduces: {
					WIFI: "有",
					容纳: "2-3人",
					早餐: "有",
					热水: "有",
					电脑: "有",
					电视: "有",
					面积: "14m²",
				},
				maxPeople: 1,
				number: "201",
				type: {
					coverImage: "./img/sEXDVe.jpg",
					detailUrl: "",
					feature: "“舒适、简洁”",
					id: 1,
					introduce: "14㎡-15㎡",
					price: 188,
					typeName: "单人房",
				},
				form: {
					indate: '',
					leavedate: '',
					people_num: 0,
				},
			},
			listdata: [],
			paginatedList: [],
			roomtype: [],
			currentPage: 1,
			pageSize: 6,
		}
	},
	watch: {
		'form.indate': function (newVal, oldVal) {
			this.form.indate = newVal;
			if (this.form.indate != null && this.form.leavedate != null)
				this.calcPrice();
			else
				this.sumprice = '--';
		},
		'form.leavedate': function (newVal, oldVal) {
			this.form.leavedate = newVal;
			if (this.form.indate != null && this.form.leavedate != null)
				this.calcPrice();
			else
				this.sumprice = '--';
		}
	},
	methods: {
		searchBtn() {
			if (this.form.indate == "" || this.form.leavedate == "") {
				this.warning = '您还没有选择完整的时间段!';
				this.dialogVisible = true;
				return;
			}
			if (new Date(this.form.indate) >= new Date(this.form.leavedate)) {
				this.warning = '入店时间必须小于离店时间!';
				this.dialogVisible = true;
				return;
			}
			this.axios.post("http://localhost:9151/user/listRoom", {
				"inTime": this.changeTimeStr(this.form.indate),
				"leaveTime": this.changeTimeStr(this.form.leavedate),
				"roomType": this.form.selectedType,
				"maxPeople": this.form.max_people,
				"minPrice": this.form.min_price,
				"maxPrice": this.form.max_price
			})
				.then(res => {
					this.listdata = res.data.data;
					//this.$store.state.searchSet = res.data.data;
					//this.$store.state.searchTime.inTime = this.changeTimeStr(this.form.indate);
					//this.$store.state.searchTime.leaveTime = this.changeTimeStr(this.form.leavedate);
					//this.$router.push("/search");
					this.heading = '为您找到 ' + this.listdata.length + ' 条结果';
					this.refreshList();
				})
				.catch(() => {
					console.log("error");
				})

		},
		openDialog(tp) {
			this.bookRoom = tp;
			console.log(this.bookRoom);
			this.bookDialogVisible = true;
			this.calcPrice();
		},
		confirmSubmitForm() {
			this.bookDialogVisible = false;
			if (this.form.indate == null || this.form.leavedate == null) {
				this.$message({
					message: "您还没有选择完整的时间段!",
					type: "error",
				});
				this.bookDialogVisible = true;
				this.form.isNeedInvoice = false;
				return;
			}
			if (new Date(this.form.indate) > new Date(this.form.leavedate)) {
				this.$message({
					message: '入店时间必须小于离店时间!',
					type: "error",
				});
				this.bookDialogVisible = true;
				this.form.isNeedInvoice = false;
				return;
			}
			let json = {
				roomId: this.bookRoom.id,
				inTime: this.changeTimeStr(this.form.indate),
				leaveTime: this.changeTimeStr(this.form.leavedate),
				realPeople: this.form.max_people,
				fapiao: this.form.isNeedInvoice ? 1 : 0,
			};
			console.log(json);
			this.axios
				.post("http://localhost:9151/user/bookRoom", json)
				.then((res) => {
					if (res.data.code != "200") {
						this.$message({
							message: "请先登录!",
							type: "error",
						});
						this.$router.push("/");
					} else {
						this.$router.push("/submitok");
					}
				})
				.catch((res) => {
					this.$router.push("/submitfail");
				});
			this.form.isNeedInvoice = false;
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
		unity() {
			window.open("http://unity.abohelloworld.top/");
		},
		resolveData() {
			this.axios
				.get(
					"http://localhost:9151/user/roomTypes"
				)
				.then((res) => {
					this.roomtype = res.data.data;
					console.log(this.roomtype);
				})
				.catch(() => {
					console.log("filed get roomtype");
				});
		},
		handlePrevClick() {
			this.currentPage--;
			this.refreshList();
		},
		handleNextClick() {
			this.currentPage++;
			this.refreshList();
		},
		handleCurrentChange(page) {
			this.currentPage = page;
			this.refreshList();
		},
		refreshList() {
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			this.paginatedList = this.listdata.slice(startIndex, endIndex);
		},
		calcPrice() {
			let stra = this.changeTimeStr(this.form.leavedate);
			let sa1 = stra.split(" ")[0].split("-");
			let sa2 = stra.split(" ")[1].split(":");
			let leaveTime = new Date();
			leaveTime.setFullYear(sa1[0], sa1[1], sa1[2]);
			leaveTime.setHours(sa2[0]);
			leaveTime.setMinutes(sa2[1]);
			let strb = this.changeTimeStr(this.form.indate);
			if (strb > stra) {
				this.sumprice = '--';
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
			let price = this.bookRoom.type.price;
			this.sumprice = price * realday;
			if (isNaN(this.sumprice)) {
				this.sumprice = '--';
			}
			//console.log("单价: " + price + " 时长: " + realday + " 总价: " + this.sumprice);
			// console.log(this.bookstat.leaveTime,this.bookstat.inTime,this.bookstat.leaveTime - this.bookstat.inTime);
		},
	},
	mounted() {
		this.axios.get("http://localhost:9151/user/listAllSpareRoom")
			.then(res => {
				this.listdata = res.data.data;
				console.log("get listAllSpareRoom hit");
				console.log(this.listdata);
				this.refreshList();
			})
			.catch(res => {
				console.log(res);
			}),
			this.resolveData();
		this.axios.get("http://localhost:9151/user/isLoggedIn")
			.then(res => {
				if (res.data.code == "200") {
					this.username = res.data.data;
					this.isLoggedIn = true;
				} else {
					this.isLoggedIn = false;
				}
			})
	}
}
</script>

<style scoped="scoped">
.box-card {
	height: 13vh;
	width: 100rem;
	margin: 1rem auto 0;
}

.time {
	font-size: 13px;
	color: #999;
}

.bottom {
	margin-top: 13px;
	line-height: 12px;
}

.button {
	padding: 0;
	float: right;
}

.image {
	width: 130%;
	display: block;
	padding: 1rem;
	border: 1px solid transparent;
	border-radius: 20px;
	aspect-ratio: 4/3;
}

.book-image {
	width: 260%;
	display: block;
	padding: 1rem;
	border: 1px solid transparent;
	border-radius: 20px;
	aspect-ratio: 16/9;
}

x .clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both
}

.room p {
	margin-bottom: 0.25rem;
	margin-top: 0;
	margin-left: 4rem;
}

.room-title {
	font-size: 1.2rem;
	font-weight: bolder;
	color: #303133;
}

.room-intro {
	font-size: 0.9rem;
	color: #606266;
}

.room-price {
	font-size: 1.2rem;
	color: #F56C6C;
}

.room-comment {
	font-size: 0.8rem;
	color: #909399;
}

.black {
	color: #303133;
}

.nav-link {
	color: black;
	margin-right: 24px;
	text-decoration: none;
}

.nav-link:hover {
	text-decoration: underline;
}

.label-text {
	margin-right: 10px;
	display: flex;
	align-items: flex-start;
	flex-direction: column;
}

.container {
	width: 105rem;
	margin-left: -20px;
	margin-right: -10px;
}

.room-price {
	font-size: 1.3rem;
	color: #f56c6c;
}

.pagination-container {
	display: flex;
	justify-content: center;
}
</style>
