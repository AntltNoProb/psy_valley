<template>
    <div style="padding: 10px">
        <!--    功能区域-->
        <el-main style="margin: 10px 0">
            <el-row :gutter="10">
                <el-col :span=8>
                    <consultCount class="grid-content" :count="todayConsultCount" :time="todayConsultTime" />
                </el-col>
                <el-col :span=16>
                    <constructingPage />
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <onlineConsultant class="grid-content" />
                </el-col>
                <el-col :span="12">
                    <onlineConsultant class="grid-content" />
                </el-col>
            </el-row>
        </el-main>

    </div>
</template>
<script>
import consultCount from "@/components/homePage/consultCount.vue";
import onlineConsultant from "@/components/homePage/onlineConsultant.vue";
import constructingPage from "@/components/homePage/constructingPage.vue";
export default {
    name: 'VueHome',
    components: {
        consultCount,
        onlineConsultant,
        constructingPage,
    },
    data() {
        return {
            todayConsultCount: 0,
            todayConsultTime: new Date(2023, 5, 2, 0, 0, 0),
        }
    }
}
</script>
<style>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}


.grid-content {
    min-height: 90px;
}
</style>
