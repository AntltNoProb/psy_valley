<template>
    <div>
        <p>
            简陋聊天
        </p>
        userId <input type="text" v-model="userId"> <button @click="loginHandler">登录</button>
    </div>
    <div>
        lihua: <input type="text" v-model="msg"> <button @click="senMsg">给lihua发送消息</button>
    </div>
    <div>
        聊天窗
        <ul>
            <li :class="{'other': ele.flow == 'in', 'mine': ele.flow == 'out'}" v-for="ele in messageList" :key="ele">
                <div>用户名：{{ele.from}}</div> <div>内容:{{ele.payload.text}}</div>
            </li>
        </ul>
    </div>
</template>

<script>

import {genTestUserSig} from '@/IMdebug/GenerateTestUserSig'
import {mapActions, mapMutations, mapState} from "vuex";
import {IM_APP_ID} from "@/IMconfig/im";
import TIM from "tim-js-sdk";


export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "chat",
    data(){
        return {
            userId: '',
            msg: '',
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
            if(!this.imReady){
                alert('IM系统还未准备好');
                return
            }
            if(this.msg.trim() === ''){
                alert('请输入聊天信息');
                return
            }
            //发送消息
            let message = this.$tim.createTextMessage({
                to: 'lihua',
                conversationType: this.$TIM.TYPES.CONV_C2C,
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
            let promise = this.$tim.sendMessage(message);
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
.mine{
    background-color: #ccc;
    border: 1px solid #000;
}
</style>