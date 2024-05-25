<!--
 * @Description: 
 * @Author: Rusher
 * @Date: 2023-03-11 13:37:23
-->
<template>
    <div class="user-table">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="房间id"> </el-table-column>
            <el-table-column prop="number" label="房间号"> </el-table-column>
            <el-table-column prop="type.typeName" label="房间类型"> </el-table-column>
            <el-table-column prop="maxPeople" label="最大容纳人数">
            </el-table-column>
            <el-table-column prop="type.feature" label="客房简介">
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right" >
                <template slot-scope="scope">
                    <el-button
                        type="danger"
                        @click="deleteRoom(scope.row.id)"
                        
                        style="font-size: 18px;"
                        >
                         删除</el-button
                    >
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
        deleteRoom(roomId) {
            // 删除房间
            this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.axios
                        .post(
                            process.env.VUE_APP_BASE_URL + "/reception/deleteRoom?roomId=" +
                                roomId
                        )
                        .then((res) => {
                            this.$message({
                                type: "success",
                                message: "删除成功",
                            });
                            this.listRooms();
                        })
                        .catch((res) => {
                            this.$message({
                                type: "error",
                                message: "删除失败",
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        listRooms() {
            this.axios
                .post(process.env.VUE_APP_BASE_URL + "/reception/listRoom")
                .then((res) => {
                    console.log(res.data.data);
                    this.tableData = res.data.data;
                    for (var i = 0; i < this.tableData.length; ++i) {
                        // 房间状态
                        if (this.tableData[i].state == 0) {
                            this.tableData[i].state = "空闲";
                        } else if (this.tableData[i].state == 1) {
                            this.tableData[i].state = "已入住";
                        }
                    }
                })
                .catch((res) => {
                    console.log("err: " + res);
                });
        },
    },
    mounted() {
        this.listRooms();
    },
};
</script>

<style>
.user-table {
    margin: 2rem;
}
</style>
