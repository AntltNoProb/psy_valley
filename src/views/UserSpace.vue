<template>

    <div style="padding: 150px;">
        <el-form ref="userform" :model="form" label-width="120px" style="width: 700px" :rules="rules">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" style="width: 80%" ></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" style="width: 80%" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" style="width: 80%" ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio v-model="form.gender" label="男">男</el-radio>
                <el-radio v-model="form.gender" label="女">女</el-radio>
            </el-form-item>
        </el-form>
        <span style="margin: 150px auto">
        <el-button type="primary" @click="save" style="margin: 50px 200px">Confirm</el-button>
      </span>
    </div>
</template>
<script>

//import request from "../utils/request";
//import {ElMessage} from "element-plus";

export default {
    name: 'UserSpace',
    components: {
    },
    data() {
        const validnum = (rule, value, callback) => {
            if(!Number.isInteger(value)){
                callback(new Error("要求是数字"))
            } else {
                callback()
            }
        }
        const checklen = (rule, value, callback) => {
            if(String(this.form.phonenum).length !== 11) {
                callback(new Error("手机号要求11位"))
            } else {
                callback()
            }
        }
        return {
            user:{},
            form:{
                name:null,
                username:null,
                password:null,
                gender:null,
            },
            rules:{
                phonenum: [
                    {
                        validator: validnum,
                        trigger: 'blur',
                    },
                    {
                        validator: checklen,
                        trigger: 'blur',
                    },
                ]
            },
        }
    },
    created() {
        //这一段代码比较重要，是通过token去后端请求其user信息
        //this.userStr = localStorage.getItem('Authorization')
        //let userinfo = sessionStorage.getItem("user")
        // if(!userinfo){
        //     //console.log(JSON.stringify(this.userStr))
        //     request.post("/api/user/self", this.userStr).then(res =>{
        //         console.log(res)
        //         if(res.code === '0'){
        //             this.form.username =res.data.username
        //             this.form.age = Number(res.data.age)
        //             this.form.sex = res.data.sex
        //             this.form.phonenum = Number(res.data.phonenum)
        //         }
        //     })
        // }else {
        //     this.user = JSON.parse(userinfo)
        //     this.form.username =this.user.username
        //     this.form.sex = this.user.sex
        //     this.form.phonenum = Number(this.user.phonenum)
        // }
    },
    mounted(){
        document.title='个人信息'
    },
    methods:{
        save(){

        },
    }
}
</script>
<style scoped>

</style>