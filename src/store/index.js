import { createStore } from 'vuex'
// import TIM from "tim-js-sdk";
// import {IM_APP_ID} from "@/IMconfig/im";
import { globaltim } from '../main.js';
export default createStore({
    state: {
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',// 存储token
        imReady: false,   //存储IM准备状态
        messageList: [], //存储聊天记录 1.之前和别人的 2.别人给我的 3.我给别人的
    },
    mutations: {
        // 修改token，并将token存入localStorage
        changeLogin (state, user) {
            state.Authorization = user.Authorization;
            localStorage.setItem('Authorization', user.Authorization);
        },
        updateIMStatus(state, payload){
            state.imReady = payload;
        },
        updateMessageList(state, payload){
            state.messageList = payload;
        },

        // payload传自己发送的消息
        updateMySendMsg(state, payload){
            state.messageList = [...state.messageList, payload];
        },

        //别人给我发
        updateOtherSendToMeMsg(state, payload){
            if(payload.payload.text != null){
                state.messageList = [...state.messageList, payload];
            }
            console.log(state.messageList, 'message======================');
        },
    },
    actions: {
        //payload传递userId

        async getMessageList(store, payload){
            console.log(payload.userId);
            console.log(globaltim, "globatim============");
            // // 打开某个会话时，第一次拉取消息列表，注意！第一次拉取时不要传入 nextReqMessageID
            // let options = {
            //     SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
            // };
            // let tim = TIM.create(options);
            let imResponse = await globaltim.getMessageList({conversationID: 'C2C'+ payload.userId});
            console.log(imResponse);
            store.commit('updateMessageList', imResponse.data.messageList);
        }
    },
    modules: {
    },
})


