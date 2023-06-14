<template>
    <div>
        <!--    功能区域-->
        <el-main style="margin: 10px 10px;">
            <el-row :gutter="10">
                <el-col :span=12><constructingPage /></el-col>
                <el-col :span=12><scheduleViewer /></el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span=16><constructingPage /></el-col>
                <el-col :span=8><constructingPage /></el-col>
            </el-row>
        </el-main>

    </div>
</template>
<script>
import constructingPage from "@/components/homePage/constructingPage.vue";
import scheduleViewer from "@/components/homePage/scheduleViewer.vue";
export default {
    name: 'VueHome',
    components: {
        constructingPage,
        scheduleViewer,
    },
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
    min-height: 200px;
}
</style>
