<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        style="width: 200px; min-height: calc(100vh - 50px) "
        :default-active="$route.path"
        router
        class="el-menu-vertical-demo">
        <el-menu-item index="/home">
            <el-icon><icon-menu /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/working-schedule">
            <el-icon><icon-menu /></el-icon>
            <span>排班管理</span>
        </el-menu-item>
        <el-menu-item index="/consult-record">
            <el-icon><icon-menu /></el-icon>
            <span>咨询记录</span>
        </el-menu-item>
        <el-menu-item index="/counselor-management">
            <el-icon><icon-menu /></el-icon>
            <span>咨询师管理</span>
        </el-menu-item>
        <el-menu-item index="/visitor-management">
            <el-icon><icon-menu /></el-icon>
            <span>访客管理</span>
        </el-menu-item>
        <el-menu-item index="/supervisor-management">
            <el-icon><icon-menu /></el-icon>
            <span>督导管理</span>
        </el-menu-item>
        <el-menu-item index="/userspace">
            <el-icon><setting /></el-icon>
            <template #title>账户设置</template>
        </el-menu-item>
    </el-menu>
</template>
<script>

import {
    Menu as IconMenu,
    Setting,
    ArrowDown ,

} from '@element-plus/icons'

export default {
    name:"AsideSystemManager",
    data(){
        return{

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