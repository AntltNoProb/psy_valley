import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import Router from './router'
import 'element-plus/dist/index.css'
import Store from './store'
import {IM_APP_ID} from "@/IMconfig/im";


import audio from 'vue-mobile-audio'
import Quill from "vue-quill-editor"

import 'echarts';
import VECharts from "vue-echarts";


// 从v2.11.2起，SDK 支持了 WebSocket，推荐接入；v2.10.2及以下版本，使用 HTTP
// v2.24.0起，SDK 支持使用本地审核插件
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
// import store from "./store";
let options = {
    SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示
console.log(tim);


// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html#setLogLevel 接口的说明</a>
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用

// 注册腾讯云即时通信 IM 上传插件
tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

// 注册腾讯云即时通信 IM 本地审核插件
tim.registerPlugin({'tim-profanity-filter-plugin': TIMProfanityFilterPlugin});

// eslint-disable-next-line no-unused-vars
// let onSdkReady = function(event) {
//     //定义状态变量，标识IM是否准备好
//     console.log('onSdkReady im ======================');
//     // store.commit('updateIMStatus', true);
// };
// //监听ready事件
// tim.on(TIM.EVENT.SDK_READY, onSdkReady);

// let onMessageReceived = function(event) {
//     // event.data - 存储 Message 对象的数组 - [Message]
//     console.log(event.data);
//     // 把发送来的消息更新到仓库
//     if(event.data[0]!=='') {
//         store.commit('updateOtherSendToMeMsg', event.data[0]);
//     }
// };
// //监听发送来的消息
// tim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);


const app = createApp(App);


app.use(ElementPlus).use(Quill).use(Store).use(Router).use(audio).component('v-chart', VECharts).mount('#app')
export const globaltim = tim;

