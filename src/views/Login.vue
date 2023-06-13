<template>
    <div class="login" @keyup.enter="login">
        <div style="width: 400px;margin: 150px auto">
            <div style="font-size: 30px;text-align: center; padding: 30px 0">欢迎登录心声谷</div>
            <el-form ref="form" :model="form" size="normal" :rules="rules">
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
import {genTestUserSig} from "@/IMdebug";
// import {IM_APP_ID} from "@/IMconfig/im";
// import TIM from "tim-js-sdk";
import store from "@/store";
import {globaltim} from "@/main";
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
                    {pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\\s]{2,32}$/,required: true, message: '用户名格式错误', trigger: 'blur'}
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

                            // TIM登录
                            console.log(this.form.username);
                            let userID = this.form.username;
                            let userSig = genTestUserSig(userID).userSig; //签名信息
                            console.log(userSig, 'userSig==============================');

                            console.log(globaltim, 'globaltim==================');
                            try {
                              // let options = {
                              //   SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
                              // };
                              // let tim = TIM.create(options);
                              // // eslint-disable-next-line no-unused-vars

                              //定义状态变量，标识IM是否准备好
                              console.log('onSdkReady im ======================');
                              store.commit('updateIMStatus', true);

                              let response = globaltim.login({userID: userID, userSig: userSig});
                              console.log(response, '登录后的信息===================================');
                              // console.log('onSdkReady im ======================');
                              // store.commit('updateIMStatus', true);
                              //
                              // console.log(tim);
                              // let response = tim.login({userID: userID, userSig: userSig});
                              // console.log(response, '登录后的信息===================================');
                            } catch (e){
                              console.log(e, '登录错误');
                            }

                            sessionStorage.setItem("user", JSON.stringify(res.data.user))
                            this.$router.push("/")

                        }else{

                            ElMessage({
                                type: 'error',
                                message: 'false',

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

