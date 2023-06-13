<template>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            text-color="#fff"
            style="width: 200px; min-height: calc(100vh - 90px) "
            :default-active="$route.path"
            router
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
        <el-sub-menu >
            <template #title>
                <el-icon><IconMenu /></el-icon>
                <span>会话管理</span>
            </template>
            <el-menu-item-group title="咨询">
                <el-menu-item v-for="(o, cnt) in currentVisitors" :key="o" @click="$router.push({ name: 'chat', state: { name: visitorNames[cnt] }})">
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

export default {
    name:"AsideConsultant",
    data(){
        return{
            currentVisitors: 4,
            visitorNames:["wang", "wen", "hai", "lihua"],
            currentSupervisor:2,
            SupervisorNames:['wu','xu']
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