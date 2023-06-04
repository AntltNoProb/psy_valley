<template>
    <el-container class="home-container">
        <el-header><!-- 头部区 -->
            <div>
                <span>心声谷</span>
            </div>
            <el-dropdown >
                <span class="el-dropdown-link">
                    {{user.name}} <el-icon class="el-icon--right"><arrow-down/></el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="$router.push('/userspace')">个人信息</el-dropdown-item>
                        <el-dropdown-item @click="exit">退出系统</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>
    </el-container>
</template>


<script>
import {ArrowDown} from "@element-plus/icons";


export default {
    name: "VueHeader",

    data(){
        return{
            user:{},
        }
    },
    components:{
        ArrowDown,
    },
    created() {
        let userinfo = sessionStorage.getItem("user")
        this.user = JSON.parse(userinfo)
    },
    methods:{
        exit(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
};
</script>

<style lang="less">
.home-container{
  height: 100%;
}
.el-header{
  background-color: #eaedf1;
  display: flex; //设置显示为flex布局
  justify-content: space-between;//设置为flex左右布局
  padding-left: 0;//左内边距为0（Logo贴左边）
  align-items: center;//元素上下居中（防止右边按钮贴上下边）
  color: #000000;
  font-size: 20px;
  > div {//内嵌的div样式
    display: flex;
    align-items: center;//Logo和文字上下居中
    span {
      margin-left: 15px;//文字左侧设置间距，防止与Logo紧贴
    }
  }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
</style>