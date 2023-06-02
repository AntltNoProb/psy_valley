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
import request from "../utils/request";
//import {ElMessage} from "element-plus";
export default {
    name: 'visitor-management',
    components: {
    },
    data() {
        return {
            form:{},
            dialogVisible: false,
            search: 'visitor',
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
            request.get("/visitors",{//访问访客，下面是一些用于SQL语句的参数
                params:{
                    pageNum: this.currentPage,//页面位置
                    pageSize:10,//页面大小
                    search: this.search //角色（对应authority）
                },
            }).then(async res => {//异步请求
                console.log(res)//你要返回的json格式{record:[" "," "],total: ""}
                this.tableData = res.data.records//记录
                this.total = res.data.total//记录数
            })
        }
    },

}
</script>