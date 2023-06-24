<template>
    <div>
        <!--    功能区域-->
        <el-main style="margin: 10px 10px">
            <el-row :gutter="10"  style="margin-bottom: 10px;">
                <el-col :span="14">

                    <el-row :gutter="10" style="margin-bottom: 10px;">
                        <el-col :span="10">
                            <infoShow class="grid-content-small" :detail="false"/>
                        </el-col>
                        <el-col :span="14">
                            <consultCount class="grid-content-small"/>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                        <onlineConsultant :user-bind="true" />
                    </el-col>
                    </el-row>
                </el-col>
                <el-col :span="10">
                    <scheduleViewer :small="true" />
                </el-col>
            </el-row>
            <el-row>
                <el-col><superviseLatest/></el-col>
            </el-row>
        </el-main>

    </div>
</template>
<script>
import constructingPage from '@/components/homePage/constructingPage.vue';
import scheduleViewer from '@/components/homePage/scheduleViewer.vue';
import consultCount from '@/components/homePage/consultCount.vue';
import onlineConsultant from '@/components/homePage/onlineConsultant.vue';
import infoShow from '@/components/homePage/infoShow.vue';
import superviseLatest from '@/components/homePage/superviseLatest.vue';
import request from "@/utils/request";
import { ElMessage } from "element-plus";
export default {
    name: 'VueHome',
    components: {
        constructingPage,
        scheduleViewer,
        consultCount,
        onlineConsultant,
        infoShow,
        superviseLatest,
    },
    methods: {
        loadTotalCount() {
            const url = 'records/totalCount';
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.count = res.data.total;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '咨询数目获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '咨询数目获取错误: ' + err,
                });
            });
        },
        loadCurrentCount() {
            const url = 'records/currentCount';
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.curCount = res.data.total;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '当前咨询数获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '当前咨询数获取错误: ' + err,
                });
            });
        },
        loadTimeStr() {
            const url = 'records/totalTime';
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.timeStr = res.data.totalTime;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '咨询时长获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '咨询时长获取错误: ' + err,
                });
            });
        },
    }
}
</script>
<style>
.grid-content {
    min-height: 200px;
}
.grid-content-small {
    min-height: 125px;
}
</style>
