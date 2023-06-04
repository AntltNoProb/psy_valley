<template>
    <div style="padding: 10px">
        <!--    搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询访客</el-button>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="pno" label="联系电话" />
            <el-table-column prop="gender" label="性别"/>
            <el-table-column prop="contact_name" label=紧急联系人 />
            <el-table-column prop="contact_pno" label="紧急联系电话"/>
            <el-table-column prop="status" label = "账号状态"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-popconfirm title="确认要修改吗?" @confirm="HandleUpdate(scope.row.status, scope.row.pno)">
                        <template #reference>
                            <el-button type = "danger" size = "small" v-if = " scope.row.status=='normal'" >禁用</el-button>
                            <el-button type = "primary" size = "small" v-show = " scope.row.status=='banned'" >解禁</el-button>
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
import request from "../utils/request";
import {ElMessage} from "element-plus";
export default {
    name: 'visitor-management',
    components: {
    },
    data() {
        return {
            form:{},
            search: "",
            dialogVisible: false,
            currentPage: 1 ,
            total: 10 ,
            tableData: [],
            keyNum:0,
        }
    },
    created(){
        this.load()
    },
    mounted() {
        document.title='访客管理'
    },
    methods :{
        createSupervisor(){
            this.dialogVisible = true
        },
        load(){
            request.get("/visitors/list",{//访问访客，下面是一些用于SQL语句的参数
                params:{
                    pageNum: this.currentPage,//页面位置
                    pageSize: 10,//页面大小
                    search: this.search //要查找的人名
                },
            }).then(async res => {//异步请求
                this.tableData = res.data.visitor//记录
                this.total = res.data.total//记录数
                console.log(res)
            })
        },
        handleCurrentChange(){
            this.load()
        },
        HandleUpdate(status,id) {//返回电话号码，进行删除

            console.log(id)
            if(status == 'banned') {
                request.patch("/visitors/enable/" + id).then(res => {
                    console.log(res)
                    if (res.code == "1") {
                        ElMessage({
                            type: 'success',
                            message: '修改成功',
                        })
                    } else {
                        ElMessage({
                            type: 'error',
                            message: res.msg,
                        })
                    }
                })
            } else {
                request.patch("/visitors/banned/" + id).then(res => {
                    console.log(res)
                    if (res.code == "1") {
                        ElMessage({
                            type: 'success',
                            message: '修改成功',
                        })
                    } else {
                        ElMessage({
                            type: 'error',
                            message: res.msg,
                        })
                    }
                })
            }
            this.load()
        },
    },
}
</script>