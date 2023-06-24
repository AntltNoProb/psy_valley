<template>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            style="width: 200px; min-height: calc(100vh - 50px)"
            :default-active="$route.path"
            :default-openeds="openeds"
            router
            class="el-menu-vertical-demo">
        <el-menu-item index="/home">
            <el-icon><icon-menu /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/consult-record">
            <el-icon><icon-menu /></el-icon>
            <span>咨询记录</span>
        </el-menu-item>
        <el-menu-item index="/working-schedule">
            <el-icon><icon-menu /></el-icon>
            <span>排班管理</span>
        </el-menu-item>
        <el-menu-item index="/dialog-record">
            <el-icon><icon-menu /></el-icon>
            <span>求助记录</span>
        </el-menu-item>

        <el-menu-item index="/userspace">
            <el-icon><setting /></el-icon>
            <template #title>账户设置</template>
        </el-menu-item>
        <el-dialog title="通知" v-model="dialogVisible" @keyup.enter="this.$router.push({path:'solve',query:{'name': counselorname, 'username':counselorusername}});dialogVisible = false">
            <el-text>有新的消息</el-text>
            <template #footer>
                      <span class="dialog-footer">
                          <el-button type="danger" size="default" @click="dialogVisible = false">取消</el-button>
                          <el-button type="primary" size="default"
                            @click="this.$router.push({path:'solve',query:{'name': counselorname, 'username':counselorusername}});dialogVisible = false">确定</el-button>
                      </span>
            </template>
        </el-dialog>
        <el-sub-menu index="1">
            <template #title>
                <el-icon><IconMenu /></el-icon>
                <span>会话管理</span>
            </template>
            <el-menu-item-group title="解决求助">
                <el-menu-item v-for="(o, cnt) in currentCounselors" :key="o" @click="$router.push({path: 'solve', query:{'name': counselorName[cnt], 'username': counselorUsername[cnt]}})">
                    <span>{{counselorName[cnt]}}</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
    </el-menu>
</template>
<script>

import {
    Menu as IconMenu,
    Setting,
    ArrowDown ,
} from '@element-plus/icons'
import {onBeforeUnmount, ref} from "vue";
import {genTestUserSig} from "@/IMdebug";
import {globaltim} from "@/main";
import TIM from "tim-js-sdk";
export default {
    name:"AsideSupervisors",
    setup(){
        let counselorName=ref([]);
        let counselorUsername=ref([]);

        // eslint-disable-next-line no-unused-vars
        let conversationList = ref([]);
        let currentCounselors = ref(0);
        let dialogVisible = ref(false);
        // TIM登录
        let userinfo = sessionStorage.getItem("user")
        let userID = JSON.parse(userinfo).username;
        console.log(userID,'username=============');
        let userSig = genTestUserSig(userID).userSig; //签名信息
        let promise1 = globaltim.login({userID: userID, userSig: userSig});

        promise1.then(function(imResponse) {
            console.log(imResponse.data, "登录成功============="); // 登录成功
            if (imResponse.data.repeatLogin === true) {
                // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
                console.log(imResponse.data.errorInfo);
            }
            //eslint-disable-next-line no-unused-vars
            let onSdkReady = function(event) {
                // 修改个人标配资料
                let promise2 = globaltim.updateMyProfile({
                    nick: JSON.parse(sessionStorage.getItem("user")).name,

                });
                promise2.then(function(imResponse) {
                    console.log(imResponse.data); // 更新资料成功
                    console.log(JSON.parse(sessionStorage.getItem("user")).name, 'updateProfile');

                }).catch(function(imError) {
                    console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
                });
            };
            globaltim.on(TIM.EVENT.SDK_READY, onSdkReady);
        }).catch(function(imError) {
            console.warn('login error:', imError); // 登录失败的相关信息
        });

        let intervalId = setInterval(function (){
            let promise = globaltim.getConversationList();
            promise.then(function(imResponse) {
                conversationList.value = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
                // console.log(conversationList.value, 'conversation======');
                let item;
                counselorName.value=[];
                currentCounselors.value=conversationList.value.length;
                counselorUsername.value=[];
                for (item of conversationList.value){
                    console.log(item.userProfile.userID, 'item');
                    counselorUsername.value=[...counselorUsername.value, item.userProfile.userID];
                    counselorName.value=[...counselorName.value, item.userProfile.nick];
                }
            }).catch(function(imError) {
                console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
        }, 1000);

        let counselorname=ref('');
        let counselorusername=ref('');
      let onMessageReceived = function(event) {
        // event.data - 存储 Message 对象的数组 - [Message]
        console.log(event.data);
        // 把发送来的消息更新到仓库
        globaltim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);
        // let message = [event.data[0]];
        // sessionStorage.setItem(event.data[0].from, JSON.stringify(message));

        if(sessionStorage.getItem(event.data[0].from) != null){
            let tmp = JSON.parse(sessionStorage.getItem(event.data[0].from));
            tmp = [...tmp, event.data[0]]
            sessionStorage.setItem(event.data[0].from, JSON.stringify(tmp));
        }else {
            let message = [event.data[0]];
            sessionStorage.setItem(event.data[0].from, JSON.stringify(message));
        }

        console.log(sessionStorage.getItem(event.data[0].from),'assistSession===');
        if(event.data[0].payload.text != 'TERMINATE'){
            dialogVisible.value=true;
            counselorusername.value = event.data[0].from;
            counselorname.value=event.data[0].nick;
        }
      };
      //监听发送来的消息
      globaltim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);

        onBeforeUnmount(() => {
            clearInterval(intervalId)
            intervalId = null;
        })

        return{
            dialogVisible,
            counselorusername,
            counselorname,
            counselorName,
            counselorUsername,
            currentCounselors,
        }
    },
    data(){
        return{
            openeds: ['1'],
            uniqueOpened: false,
        }
    },
    mounted() {
        document.title='心声谷'
    },
    components: {
        Setting,
        ArrowDown ,
        IconMenu,
    },
}
</script>