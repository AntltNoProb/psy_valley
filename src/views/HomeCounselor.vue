<template>
    <div>
        <!--    功能区域-->
        <el-main style="margin: 10px 10px;">
            <el-row :gutter="10" style="margin-bottom: 10px;">
                <el-col :span="14">
                    <el-row style="margin-bottom: 10px;">
                        <!-- <el-col><consultCount :count="totalCount" :time-str="avgRate"/></el-col> -->
                        <el-col><infoShow :detail="true" :total-count="totalCount" :rate-p="avgRate"/></el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <consultCount :show-current="true"
                                :cur-count="curCount"
                                :count="count"
                                :time-str="timeStr"
                            />
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span=10><scheduleViewer /></el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col><consultLatest/></el-col>
            </el-row>
        </el-main>

    </div>
</template>
<script>
import constructingPage from "@/components/homePage/constructingPage.vue";
import scheduleViewer from "@/components/homePage/scheduleViewer.vue";
import consultCount from "@/components/homePage/consultCount.vue";
import consultLatest from "@/components/homePage/consultLatest.vue";
import infoShow from "@/components/homePage/infoShow.vue";
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
export default {
    name: 'VueHome',
    components: {
        constructingPage,
        scheduleViewer,
        consultCount,
        consultLatest,
        infoShow,
    },
    data() {
        return {
            timeStr: '00:00:00',
            count: 0,
            curCount: 0,
            avgRate: 0,
            totalCount: 0,
            user: {},
        };
    },
    methods: {
        loadAvgRate() {
            const url = '/counselors/avgLevel/' + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.avgRate = res.data.avgLevel;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '评分获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '评分获取错误: ' + err,
                });
            });
        },
        loadTotal() {
            const url = '/counselors/totalOrder/' + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.totalCount = res.data.totalOrder;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '咨询总数获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '咨询总数获取错误: ' + err,
                });
            });
        },
        loadTodayCount() {
            const url = '/counselors/todayCount/' + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.count = res.data.todayCount;
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
            const url = 'counselors/currentCount/' + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.curCount = res.data.current;
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
            const url = 'counselors/todayTime/' + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.timeStr = res.data.todayTime;
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
    },
    created() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.loadCurrentCount();
        this.loadAvgRate();
        this.loadTotal();
        this.loadTimeStr();
        this.loadTodayCount();
        // alert('hh')
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
