<template>
    <div>
        <!--    功能区域-->
        <el-main style="margin: 10px 10px">
            <el-row :gutter="10">
                <el-col :span=8>
                    <consultCount shadow="hover" class="grid-content"
                        :time-str="timeStr"
                        :count="count"
                     />
                </el-col>
                <el-col :span=16>
                    <todayStatistic shadow="hover" class="grid-content" />
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <onlineConsultant shadow="hover" class="grid-content" />
                </el-col>
                <el-col :span="12">
                    <onlineSuperVisor shadow="hover" class="grid-content" pager-align="flex-end" />
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <weekStatistic shadow="hover" class="grid-content" />
                </el-col>
            </el-row>
        </el-main>

    </div>
</template>
<script>
import consultCount from "@/components/homePage/consultCount.vue";
import onlineConsultant from "@/components/homePage/onlineConsultant.vue";
import constructingPage from "@/components/homePage/constructingPage.vue";
import onlineSuperVisor from "@/components/homePage/onlineSuperVisor.vue";
import todayStatistic from "@/components/homePage/todayStatistic.vue";
import weekStatistic from "@/components/homePage/weekStatistic.vue";

import request from '@/utils/request'
import { ElMessage } from 'element-plus'
export default {
    name: 'VueHome',
    components: {
        consultCount,
        onlineConsultant,
        onlineSuperVisor,
        constructingPage,
        todayStatistic,
        weekStatistic,
    },
    data() {
        return {
            timeStr: '00:00:00',
            count: 0,
            curCount: 0,
        }
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
