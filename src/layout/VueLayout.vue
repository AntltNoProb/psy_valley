<template>
    <div>
        <!--头部-->
        <Header>
            <VueHeader/>
        </Header>
        <!--主体-->
        <div style="display: flex">
            <AsideSystemManager v-if = "user.authority == 'SystemManager'"/>
            <AsideConsultant v-if = "user.authority == 'Counselor'"/>
            <AsideSupervisors v-if = "user.authority == 'Supervisor'"/>
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
            user: {},
        }
    },
    created() {
        let userinfo = sessionStorage.getItem("user")
        this.user = JSON.parse(userinfo)
        console.log(userinfo)
        //sessionStorage.setItem("user", JSON.stringify(this.user))
    }
}
</script>

<style scoped>

</style>