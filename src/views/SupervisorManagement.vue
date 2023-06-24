<template>
    <div style="padding: 10px">
        <!--    搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询督导</el-button>
            <el-button type="primary" style="float:right" @click="createSupervisor">新增督导</el-button>
            <el-dialog v-model="dialogVisibleCreate" title="新建督导" width="30%" @close="resetForm()">
                <el-form :model="form" label-width="120px">
                    <el-form-item label = "姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label = "用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label = "密码">
                        <el-input v-model="form.password" show-password/>
                    </el-form-item>
                    <el-form-item label = "性别">
                        <el-radio v-model="form.gender" label="男">男</el-radio>
                        <el-radio v-model="form.gender" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label = "联系电话">
                        <el-input v-model="form.pno"></el-input>
                    </el-form-item>
                    <el-form-item label = "工作单位">
                        <el-input v-model="form.workunit"></el-input>
                    </el-form-item>
                    <el-form-item label = "邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogVisibleCreate = false; resetForm()">取消</el-button>
                        <el-button type="primary" @click="saveCreate">确定</el-button>
                      </span>
                </template>
            </el-dialog>

            <el-dialog v-model="dialogVisibleUpdate" title="修改督导" width="30%" @close="resetForm()">
                <el-form :model="form" label-width="120px">
                    <el-form-item label = "姓名">
                        <el-input v-model="form.name" ></el-input>
                    </el-form-item>
                    <el-form-item label = "用户名">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label = "密码">
                        <el-input v-model="form.password" show-password/>
                    </el-form-item>
                    <el-form-item label = "性别">
                        <el-radio v-model="form.gender" label="男">男</el-radio>
                        <el-radio v-model="form.gender" label="女">女</el-radio>
                    </el-form-item>
                    <el-form-item label = "联系电话">
                        <el-input v-model="form.pno"></el-input>
                    </el-form-item>
                    <el-form-item label = "工作单位">
                        <el-input v-model="form.workunit"></el-input>
                    </el-form-item>
                    <el-form-item label = "邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogVisibleUpdate = false; resetForm()">取消</el-button>
                        <el-button type="primary" @click="saveUpdate">确定</el-button>
                      </span>
                </template>
            </el-dialog>

            <el-dialog v-model="dialogVisibleSchedule" title="编辑排班" width="50%" align-center @close="resetForm()">
                <dialogSchedule ref="sche" :user="editUser"></dialogSchedule>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisibleSchedule = false; resetForm()">取消</el-button>
                        <el-button type="primary" @click="saveSchedule($refs.sche.toRaw())">确定</el-button>
                    </span>
                </template>
            </el-dialog>

        </div>



        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column prop="name" label="姓名"/>
            <el-table-column prop="username" label="用户名"/>
            <el-table-column prop="pno" label="联系电话"/>
            <el-table-column prop="gender" label="性别"/>
            <el-table-column prop="email" label="邮箱"/>
            <el-table-column prop="title" label="职称"/>
            <el-table-column prop='workunit' label="工作单位"/>
            <el-table-column prop="duration" label="累计时长"/>
            <el-table-column prop="status" label="账号状态"/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type = "success" size="small" style="margin-left: 10px" @click="handleEditInformation(scope.row)">修改</el-button>
                    <el-button type = "primary" size="small" style="margin-left: 10px" @click="handleEditSchedule(scope.row)">排班</el-button>
                    <el-popconfirm size="small" title="确认要操作吗?" @confirm="HandleUpdate(scope.row.status, scope.row.username)">
                        <template #reference>
                            <el-button type = "danger" style="margin-left: 10px" size = "small" v-if = " scope.row.status=='normal'" >禁用</el-button>
                            <el-button type = "primary" style="margin-left: 10px" size = "small" v-show = " scope.row.status=='banned'" >解禁</el-button>
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
import dialogSchedule from "@/components/dialogSchedule.vue";

import {
    Lock,
} from '@element-plus/icons'


export default {
    name: 'supervisor-management',
    components: {
        Lock,
        dialogSchedule,
    },
    data() {
        return {
            form:{},
            dialogVisibleCreate: false,
            dialogVisibleUpdate: false,
            dialogVisibleSchedule: false,
            search: '',
            currentPage: 1,
            total: 10 ,
            tableData: [],
            pageSize: 10,
            editUser: {},
        }
    },
    created(){
        this.load()
    },
    mounted() {
        document.title='督导管理'
    },
    methods :{
        resetForm(){
            this.form = {}
        },
        load(){
            request.get("/supervisors/list",{
                params:{
                    pageNum: this.currentPage,//页面位置
                    pageSize: 10,//页面大小
                    search: this.search //要查找的人名
                },
            }).then(async res => {//异步请求
                this.tableData = res.data.supervisors
                this.total = res.data.total
                console.log(res)

            })
        },
        createSupervisor(){
            this.dialogVisibleCreate = true
        },
        handleEditSchedule(row) {
            this.editUser = row;
            this.dialogVisibleSchedule = true;
            if (this.$refs.sche) {
                this.$refs.sche.loadRow();
            }
        },
        saveCreate(){
            request.post("/supervisors/insert",this.form).then(res => {
                console.log(res)
                if(res.code == "1"){
                    ElMessage({
                        type: 'success',
                        message: '新增成功',
                    })
                }else{
                    ElMessage({
                        type: 'error',
                        message: res.msg,
                    })
                }
                this.load()
            })
            this.dialogVisibleCreate = false

        },
        saveSchedule(raw) {
            const url = 'arrange/updateArrange';

            request.post(url, {
                workers: [{
                    w_username: this.editUser.username,
                    w_name: this.editUser.name,
                },],
                dates: raw,
            }).then(res => {
                if (res.code == '1') {
                    ElMessage({
                        type: 'success',
                        message: '修改排班成功',
                    });

                } else {
                    ElMessage({
                        type: 'success',
                        message: '修改排班失败, 服务器返回: ' + res.message,
                    });
                }

            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '修改排班出错:' + err,
                });
            });
            this.dialogVisibleSchedule = false;
        },
        saveUpdate(){
            request.patch("/supervisors/update",this.form).then(res => {
                console.log(res)
                if(res.code == "1"){
                    ElMessage({
                        type: 'success',
                        message: '修改成功',
                    })
                }else{
                    ElMessage({
                        type: 'error',
                        message: res.msg,
                    })
                }
                this.load()
            })
            this.dialogVisibleUpdate = false
        },
        HandleUpdate(status,id) {//返回username，进行删除
            console.log(id)
            if(status == 'banned') {
                request.patch("/supervisors/enable/" + id).then(res => {
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
                request.patch("/supervisors/banned/" + id).then(res => {
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
        handleCurrentChange(){
            this.load()
        },
    },
}
</script>