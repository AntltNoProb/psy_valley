<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        style="width: 200px; min-height: calc(100vh - 90px) "
        :default-active="$route.path"
        router
        :default-openeds="openeds"
        class="el-menu-vertical-demo">
        <el-menu-item index="/home">
            <el-icon><icon-menu /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/working-schedule">
            <el-icon><icon-menu /></el-icon>
            <span>排班</span>
        </el-menu-item>
        <el-menu-item index="/consult-record">
            <el-icon><icon-menu /></el-icon>
            <span>咨询记录</span>
        </el-menu-item>
        <el-menu-item index="/userspace">
            <el-icon><setting /></el-icon>
            <template #title>账户设置</template>
        </el-menu-item>
        <el-sub-menu index="1">
            <template #title>
                <el-icon><IconMenu /></el-icon>
                <span>会话管理</span>
            </template>
            <el-menu-item-group title="咨询">
                <el-menu-item v-for="(o, cnt) in currentVisitors" :key="o" @click="$router.push({path: 'chat', query:{name: visitorNames[cnt]}})">
                    <span>{{visitorNames[cnt]}}</span>
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="求助">
                <el-menu-item v-for="(o, inx) in currentSupervisor" :key="o" @click="$router.push('/assist')">
                    <span>{{SupervisorNames[inx]}}</span>
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
import {ref} from "vue";
import {globaltim} from "@/main";
import {genTestUserSig} from "@/IMdebug";

export default {
    inject:['reload'],
    name:"AsideConsultant",
    setup(){
        let visitorNames=ref([]);
        let SupervisorNames=ref([]);
        let conversationList = ref([]);
        let currentVisitors = ref(0);
        let currentSupervisor = ref(0);

        // TIM登录
        let userinfo = sessionStorage.getItem("user")
        let userID = JSON.parse(userinfo).username;
        console.log(userID);
        let userSig = genTestUserSig(userID).userSig; //签名信息
        console.log(userSig, 'userSig==============================');
        try {
            console.log('onSdkReady im ======================');
            let response = globaltim.login({userID: userID, userSig: userSig});
            console.log(response, '登录后的信息===================================');
        } catch (e){
            console.log(e, '登录错误');
        }
        // eslint-disable-next-line no-unused-vars
        let intervalId = setInterval(function (){
            let promise = globaltim.getConversationList();
            promise.then(function(imResponse) {
                conversationList.value = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
                console.log(conversationList.value);
                let item;
                visitorNames.value=[];
                currentVisitors.value=conversationList.value.length;
                for (item of conversationList.value){
                    // console.log(item, 'item===========');
                    visitorNames.value=[...visitorNames.value, item.userProfile.userID];
                }
            }).catch(function(imError) {
                console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
        }, 1000);


        return{
            visitorNames,
            SupervisorNames,
            currentVisitors,
            currentSupervisor
        }
    },
    data(){
        return{
            openeds: ['1'],
            uniqueOpened: false
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