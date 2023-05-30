<template>
    <div style="padding: 10px">
        <!--    搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询咨询师</el-button>
            <el-button type="primary" style="float:right" @click="createSupervisor">新增咨询师</el-button>

            <el-dialog v-model="dialogVisible" title="新建咨询师" width="30%">
                <el-form :model="form" label-width="120px">
                    <el-form-item label = "用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label = "密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label = "姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label = "性别">
                        <el-radio v-model="form.gender" label="man">男</el-radio>
                        <el-radio v-model="form.gender" label="woman">女</el-radio>
                    </el-form-item>
                    <el-form-item label = "电话号码">
                        <el-input v-model="form.phonenum"></el-input>
                    </el-form-item>
                    <el-form-item label = "工作单位">
                        <el-input v-model="form.workspace"></el-input>
                    </el-form-item>
                    <el-form-item label = "邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
          </span>
                </template>
            </el-dialog>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="phonenum" label="联系电话"/>
            <el-table-column prop="username" label = "用户名"/>
            <el-table-column prop="status" label="邮箱" />
            <el-table-column prop="duration" label="累计时长"/>
            <el-table-column prop="status" label = "账号状态"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row)">排班</el-button>
                    <el-popconfirm title="确认要导出吗?" @confirm="HandleDelete(scope.row.id)">
                        <template #reference>
                            <el-button size="mini">Delete</el-button>
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
    name: 'counselor-management',
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
        document.title='咨询师管理'
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