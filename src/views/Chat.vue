
<template>
    <div style="padding: 10px">
        <el-text>{{name}}</el-text>
        <div style="margin: 10px 0">
            <el-row v-for="(itemc,indexc) in recordContent" :key="indexc">
                <el-col span="4"><el-avatar src="itemc.headUrl"/></el-col>
                <el-col span="8">{{itemc.nickName}}</el-col>
                <el-col>{{itemc.contactText}}</el-col>
            </el-row>
            <el-row>
                <el-input v-model="message" style="width: 80%" clearable />
                <el-button type="primary" style="margin-left: 7px" @click="submit">send</el-button>
            </el-row>
        </div>
    </div>
</template>
<script>

import {genTestUserSig} from '@/IMdebug/GenerateTestUserSig'
import {mapActions, mapMutations, mapState} from "vuex";
import {IM_APP_ID} from "@/IMconfig/im";
import TIM from "tim-js-sdk";


export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Chat",
    data(){
        return {
            name:"聊天对象",
            message:'',
            userId: '',
            msg: '',
            indexc: 1,
            recordContent:[
                {
                    'mineMsg': false,
                    'headUrl': null,
                    'nickName': "jack",
                    'contactText':"xiatounan",
                },
                {
                    'mineMsg': true,
                    'headUrl': null,
                    'nickName': "fine",
                    'contactText':"xiatounan",
                },
                {
                    'mineMsg': true,
                    'headUrl': null,
                    'nickName': "fine",
                    'contactText':"xiatounan",
                },
                {
                    'mineMsg': true,
                    'headUrl': null,
                    'nickName': "fine",
                    'contactText':"xiatounan",
                },
                {
                    'mineMsg': true,
                    'headUrl': null,
                    'nickName': "fine",
                    'contactText':"xiatounan",
                },

            ],

        }
    },
    watch:{
        imReady(value){
            if(value){
                this.getMessageList({userId:'lihua'});
            }
        }
    },
    computed:{
        ...mapState(['imReady', 'messageList'])
    },
    methods :{
        ...mapActions(['getMessageList']),
        ...mapMutations(['updateMySendMsg']),
        async loginHandler(){
            console.log(this.userId);
            let userID = this.userId;
            let userSig = genTestUserSig(userID).userSig; //签名信息
            console.log(userSig, 'userSig==============================');
            try {
                let options = {
                    SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
                };
                let tim = TIM.create(options);
                console.log(tim);
                let response = await tim.login({userID: userID, userSig: userSig});
                console.log(response, '登录后的信息===================================');
            } catch (e){
                console.log(e, '登录错误');
            }
        },
        senMsg(){
            let options = {
                SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
            };
            let tim = TIM.create(options);
            if(!this.imReady){
                alert('IM系统还未准备好');
                return
            }
            if(this.msg.trim() === ''){
                alert('请输入聊天信息');
                return
            }
            //发送消息
            let message = tim.createTextMessage({
                to: 'lihua',
                conversationType: TIM.TYPES.CONV_C2C,
                // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
                // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
                // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
                payload: {
                    text: this.msg
                },
                // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
                needReadReceipt: true
                // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
                // cloudCustomData: 'your cloud custom data'
            });
// 2. 发送消息
            let promise = tim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                console.log(imResponse, '发送成功');
                // 发送的消息更新代仓库，页面使用聊天记录自动更新
                this.updateMySendMsg(message);
                this.msg = '';
            }).catch(function(imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
            });
        }
    }
}
</script>

<style scoped>

.chat-content{
    width: 100%;
    height: 200px;
    padding: 20px;
    .word{
        display: flex;
        margin-bottom: 20px;
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        .info{
            margin-left: 10px;
            .time{
                font-size: 12px;
                color: rgba(51,51,51,0.8);
                margin: 0;
                height: 20px;
                line-height: 20px;
                margin-top: -5px;
            }
            .info-content{
                padding: 10px;
                font-size: 14px;
                background: #fff;
                position: relative;
                margin-top: 8px;
            }
            .info-content::before{
                position: absolute;
                left: -8px;
                top: 8px;
                content: '';
                border-right: 10px solid #FFF;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }
        }
    }

    .word-my{
        display: flex;
        justify-content:flex-end;
        margin-bottom: 20px;
        img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        .info{
            width: 90%;
            margin-left: 10px;
            text-align: right;
            .time{
                font-size: 12px;
                color: rgba(51,51,51,0.8);
                margin: 0;
                height: 20px;
                line-height: 20px;
                margin-top: -5px;
                margin-right: 10px;
            }
            .info-content{
                max-width: 70%;
                padding: 10px;
                font-size: 14px;
                float: right;
                margin-right: 10px;
                position: relative;
                margin-top: 8px;
                background: #A3C3F6;
                text-align: left;
            }
            .info-content::after{
                position: absolute;
                right: -8px;
                top: 8px;
                content: '';
                border-left: 10px solid #A3C3F6;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }
        }
    }
}
.footViewStyle{
    background-color: #F4F5F6;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0px;
}
.topViewStyle{
    background-color: #A3C3F6;
    text-align: center;
    width: 100%;
    height: 80px;
    position: fixed;
    top: 100px;
}
</style>