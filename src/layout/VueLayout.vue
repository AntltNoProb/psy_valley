<template>
    <div>
        <!--头部-->
        <Header/>
        <!--主体-->
        <div style="display: flex">
            <!--侧边栏 确认用户的权限已给出对应-->
            <AsideSystemManager/>
<!--            <AsideAdmin v-if="user.authority === 'admin'" />-->
<!--            <AsideUser v-if="user.authority === 'user'" />-->
<!--            <AsideDriver v-if="user.authority === 'employee'" />-->
            <!--内容-->
            <router-view style="flex: 1"/>
        </div>
    </div>
</template>

<script>
import VueHeader from "@/components/VueHeader.vue";
import AsideSystemManager from "@/components/AsideSystemManager.vue";
// import AsideAdmin from "../components/AsideAdmin";
// import AsideUser from "../components/AsideUser";
// import AsideDriver from "../components/AsideDriver";

export default {
    name: "VueLayout",
    components:{
        AsideSystemManager,
        VueHeader,
        // AsideAdmin,
        // AsideUser,
        // AsideDriver
    },
    data(){
        return{
            //user:{}
        }
    },
    created() {
        // let userinfo = sessionStorage.getItem("user")
        // this.user = JSON.parse(userinfo)
    }

}
</script>

<style scoped>

</style>