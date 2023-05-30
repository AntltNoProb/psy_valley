<template>
    <div>
        <!--头部-->
        <Header>
            <VueHeader/>
        </Header>
        <!--主体-->
        <div style="display: flex">
            <AsideConsultant/>
<!--            <AsideSupervisors/>-->
            <!--侧边栏 确认用户的权限已给出对应-->
<!--            <AsideSystemManager/>-->
<!--            <AsideAdmin v-if="user.authority === 'admin'" />-->
<!--            <AsideUser v-if="user.authority === 'user'" />-->
<!--            <AsideDriver v-if="user.authority === 'employee'" />-->
            <!--内容-->
            <router-view style="flex: 1"/>
        </div>
    </div>
</template>

<script>
import AsideSystemManager from "@/components/AsideSystemManager.vue";
import VueHeader from "@/components/VueHeader.vue"
import AsideSupervisors from "@/components/AsideSupervisors.vue";
import AsideConsultant from "@/components/AsideConsultant.vue";
export default {
    name: "VueLayout",
    components:{
        AsideConsultant,
        AsideSupervisors,
        AsideSystemManager,
        VueHeader,

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