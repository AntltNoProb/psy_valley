<template>

    <div style="padding: 150px;">
        <el-form model="form" label-width="120px" style="width: 700px" :rules="rules">
            <el-form-item label = "姓名:">
                <el-text>{{form.name}}</el-text>
            </el-form-item>
            <el-form-item label = "用户名:">
                <el-text>{{form.username}}</el-text>
            </el-form-item>
            <el-form-item label = "密码:">
                <el-text >{{form.password}}</el-text>
            </el-form-item>
            <el-form-item label = "性别:">
                <el-text v-if = "form.gender == '男'">{{form.gender}}</el-text>
                <el-text v-if = "form.gender == '女'">{{form.gender}}</el-text>
            </el-form-item>
            <el-form-item label = "联系电话:">
                <el-text>{{form.pno}}</el-text>
            </el-form-item>
            <el-form-item label = "工作单位:">
                <el-text>{{form.workunit}}</el-text>
            </el-form-item>
            <el-form-item label = "邮箱:">
                <el-text>{{form.email}}</el-text>
            </el-form-item>
            <el-button type="primary" @click="changePassword" style="margin: 50px 200px">修改密码</el-button>
        </el-form>
    </div>
    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" v-model="dialogFormVisible">
        <el-form :model="form" ref="pwdForm" :rules="rules">

            <el-form-item label="新密码" prop="newPassword" >
                <el-input v-model="form.newPassword" placeholder="至少6位密码" show-password></el-input>
            </el-form-item>

            <el-form-item label="确认密码" prop="checkPassword">
                <el-input v-model="form.checkPassword" show-password></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit('pwdForm')">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>


import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
    name: 'UserSpace',
    components: {
    },
    data() {
        // 检测新密码和确认密码一致性
        let checkpass = (rule, value, callback) => {
            if (value == this.form.newPassword) {
                callback();
            } else {
                callback(new Error("密码不一致"));
            }
        };
        return {
            user:{},
            dialogFormVisible: false,
            form:{
                name:'wwh',
                username:null,
                password:null,
                gender:'男',
                pno:null,
                workunit:null,
                email:null,
                newPassword:null,
                checkPassword:null
            },
            rules: {
                newPassword: [
                    { pattern: /^.{6,}$/, required: true, message: "请输入正确格式的新密码", trigger: "blur" },
                ],
                checkPassword: [
                    { pattern: /^.{6,}$/, required: true, message: "密码不同", trigger: "blur" },
                    { validator: checkpass, trigger: "blur" },
                ],
            },

        }
    },
    created() {
        this.userStr = localStorage.getItem('Authorization')
        let userinfo = sessionStorage.getItem("user")
        this.user = JSON.parse(userinfo)
        this.form =this.user
    },
    mounted(){
        document.title='个人信息'
    },
    methods:{

        changePassword(){
            this.dialogFormVisible=true
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.form.password = this.form.newPassword
                    request.post("user/changePassword",this.form).then(res => {
                        console.log(res)
                        if(res.code === "1"){
                            ElMessage({
                                type: 'success',
                                message: '修改成功，将重新登录',
                            })
                            sessionStorage.clear()
                            this.$router.push("/login")
                        }else{
                            ElMessage({
                                type: 'error',
                                message: res.msg,
                            })
                        }
                    })
                }
            });
        },
    }
}
</script>
