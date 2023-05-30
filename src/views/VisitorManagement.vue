<template>
    <div style="padding: 10px">
        <!--    搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询访客</el-button>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="phonenum" label="联系电话" />
            <el-table-column prop="contact_name" label=紧急联系人 />
            <el-table-column prop="contact_phone" label="紧急联系电话"/>
            <el-table-column prop="register_time" label="注册时间"/>
            <el-table-column prop="status" label = "账号状态"/>
            <el-table-column label="操作">
                <template #default="scope">

                    <el-popconfirm title="确认要导出吗?" @confirm="HandleDelete(scope.row.id)">
                        <template #reference>
                            <el-button size="mini">禁用</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination
                v-model:currentPage="currentPage"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="total"
                @current-change="handleCurrentChange"
                background >
            </el-pagination>

        </div>
    </div>
</template>

<script>
// import request from "../utils/request";
// import {ElMessage} from "element-plus";
export default {
    name: 'visitor-management',
    components: {
    },
    data() {
        return {
            form:{},
            dialogVisible: false,
            search: '',
            currentPage: 1 ,
            total: 10 ,
            tableData: [],
            keyNum:0,
        }
    },
    created(){
        //this.load()
    },
    mounted() {
        document.title='访客管理'
    },
    methods :{
        createSupervisor(){
            this.dialogVisible = true
        },
        // load(){
        //     request.get("/api/driver",{
        //         params:{
        //             pageNum: this.currentPage,
        //             pageSize:10,
        //             search : this.search,
        //         },
        //     }).then(async res => {
        //         for (const item of res.data.records) {
        //             await request.post("/api/user/who", item.driverid).then(res => {
        //                 if (res.code == "0") {
        //                     item.drivername = res.data.username
        //                 }
        //             })
        //         }
        //         console.log(res)
        //         this.tableData = res.data.records
        //         this.total = res.data.total
        //     })
        // },
        // save(){
        //     request.put("/api/driver",this.form).then(res => {
        //         console.log(res)
        //         if(res.code == "0"){
        //             ElMessage({
        //                 type: 'success',
        //                 message: '修改成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //         this.load()
        //     })
        //     this.dialogVisible = false
        // },
        // handleEdit(row) {
        //     this.form = JSON.parse(JSON.stringify(row))
        //     this.dialogVisible = true
        // },
        // HandleDelete(id) {
        //     console.log(id)
        //     request.delete("/api/driver/" + id).then(res => {
        //         console.log(res)
        //         if(res.code == "0"){
        //             ElMessage({
        //                 type: 'success',
        //                 message: '删除成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //     })
        //     this.load()
        // },
        // handleCurrentChange(){
        //     this.load()
        // },
    },

}
</script>