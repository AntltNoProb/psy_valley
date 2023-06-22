<template>
        <div class="login" @keyup.enter="login" >
            <div class="login-block">
                <div style="font-size: 30px;text-align: center; padding: 30px 0">欢迎登录心声谷</div>
                <el-form ref="form" :model="form" size="default" :rules="rules" style="z-index: 0">
                    <el-form-item prop="username">
                        <el-input v-model="form.username" placeholder="用户名">
                            <template #prefix>
                                <el-icon class="el-input__icon"><avatar /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" placeholder="密码" show-password>
                            <template #prefix>
                                <el-icon class="el-input__icon"><lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onShow" type="success" style="width:400px;"> 开始验证 </el-button>
                        <VerifyCode :show="isShow" @success="onSuccess" @close="onClose" />
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 100%;" type="primary" @click="login" :disabled="disabled">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
</template>
<script>
import {
    Avatar,
    Lock,
} from '@element-plus/icons'
import VerifyCode from "vue3-puzzle-vcode";
import request from "@/utils/request";
import {mapMutations} from "vuex";
import { ref } from "vue";
import {ElMessage} from "element-plus";
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "login",

    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            userStr:"",
            userToken:'',
            // 表单验证，需要在 el-form-item 元素中增加 prop 属性
            rules: {
                username: [
                    {pattern: /^[\u4e00-\u9fa5\w]{2,32}$/,required: true, message: '用户名格式错误', trigger: 'blur'}
                ],
                password: [
                    {pattern:/^.{6,}$/,required: true, message: '密码格式错误', trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        document.title='心声谷'
    },
    components: {
        Avatar,
        Lock,
        VerifyCode,
     },

    methods:{
        ...mapMutations(['changeLogin']),
        login(){
            this.$refs['form'].validate((valid) => {
                if (valid && this.isPass) {
                    request.post("user/login",this.form).then(res => {
                        console.log(res)
                        if(res.code === "1"){

                            this.userToken = res.data.token
                            // 将用户token保存到vuex中
                            this.changeLogin({ Authorization:this.userToken })
                            ElMessage({
                                type: 'success',
                                message: '登录成功',
                            })
                            sessionStorage.setItem("user", JSON.stringify(res.data.user))
                            this.$router.push("/")

                        }else if(res.code === "2"){
                            ElMessage({
                                type: 'error',
                                message: res.msg,
                            })
                            this.isPass = false
                            this.disabled = true
                        }
                        else{
                            ElMessage({
                                type: 'error',
                                message: res.msg,
                            })
                            this.isPass = false
                            this.disabled = true
                        }
                    })
                }
            })
        },
    },
    setup() {
        const isShow = ref(false);
        const disabled = ref(true);
        const isPass = ref(false);
        const onShow = () => {
            isShow.value = true;
        };

        const onClose = () => {
            isShow.value = false;
        };

        const onSuccess = () => {
            onClose(); // 验证成功，需要手动关闭模态框
            disabled.value = false;
            isPass.value = true;
        };
        return {
            isShow,
            disabled,
            isPass,
            onShow,
            onClose,
            onSuccess
        };
    }
}
</script>

<style lang="scss" scoped>
.login{
    width: 100%;
    height: 100vh;
    background-image: url("~@/assets/background.png");
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden
}
.login-block{
    width: 400px;
    background-color:#FFFFFF80;
    padding:50px;
    z-index:-1;
    margin: 150px auto
}
.login-box {
  border: 1px solid #DCDFE6;
  width: 350px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}

.login-title {
  text-align: center;
  margin: 0 auto 40px auto;
  color: #303133;
}
</style>

