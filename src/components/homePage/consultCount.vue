<template>
    <el-card class="consult-data" :body-style="{ height: '100%', width: '100%' }">
        <el-row :gutter="10" type="flex" align="middle" class="consult-row">
            <el-col :span="eachSpan" class="consult-col">
                <el-text class="consult-card-header">今日咨询数</el-text>
                <el-text class="consult-card-main" size="large" tag="b">{{ count }}</el-text>
            </el-col>
            <el-col :span="eachSpan" class="consult-col">
                <el-text class="consult-card-header">
                    今日咨询时长
                </el-text>
                <el-text class="consult-card-main" size="large" tag="b">
                    {{ timeStr }}
                </el-text>
            </el-col>
            <el-col :span="eachSpan" v-if="showCurrent" class="consult-col">
                <el-text class="consult-card-header">
                    当前咨询数
                </el-text>
                <el-text class="consult-card-main" size="large" tag="b">{{ curCount }}</el-text>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
export default {
    props: {
        showCurrent: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            eachSpan: 12,
            timeStr: '00:00:00',
            count: 0,
            curCount: '-',
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
    },
    mounted() {
        this.eachSpan = this.showCurrent ? 8 : 12;
        if (this.showCurrent) {
            this.loadCurrentCount();
        }
        this.loadTotalCount();
        this.loadTimeStr();
    }
}

</script>
<style>
.consult-data {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.consult-data .el-row .el-col {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.consult-data .el-row .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.consult-row {
    margin: auto;
    height:100%;
}


.consult-card-header {
    display: block;
    margin-bottom: 5px;
}

.consult-card-main {
    display: block;
    font-size: 2vw;
}
</style>