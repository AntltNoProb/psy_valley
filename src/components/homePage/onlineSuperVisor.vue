<template>
    <el-card class="online-supervisor">
        <el-row class="outer-row" :gutter="10" type="flex" align="middle">
            <el-col :span="18">
                <el-text class="supervise-card-header">在线督导</el-text>
                <div class="supervisor-list">
                    <div v-if="superVisorArray.length <= 0" class="s-list-placeholder">
                        <el-text type="info">暂无在线督导</el-text>
                    </div>
                    <el-row>
                        <el-tooltip :visible="false" v-for="(supervisor, index) in superVisorArray" :key="index">
                            <template #content>
                                <span>{{ supervisor.name }}</span>
                            </template>
                            <el-col :span="24" class="supervise-card">
                                <el-text class="supervise-name" truncated>{{ supervisor.name }}</el-text>
                                <el-tag 
                                    class="supervise-state"
                                    :type="supervisor.busy ? 'danger' : 'success'"
                                >
                                    {{ supervisor.busy ? '忙碌' : '空闲' }}
                                </el-tag>
                        </el-col>
                            </el-tooltip>
                                
                    </el-row>
                </div>
                <el-pagination background small 
                    :style="{'justify-content':pagerAlign}"
                    layout="prev, pager, next" 
                    :page-size="pageSize"
                    pager-count="6"
                    v-model:current-page="curPage"
                    :total="total"></el-pagination>
            </el-col>
            <el-col class="supervise-count" :span="6">
                <el-statistic title="正在进行的咨询数" :value="curCount" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
export default {
    props: {
        pagerAlign: {
            type: String,
            default: 'flex-start',
        },
    },
    data() {
        return {
            superVisorArray: [],
            total: 0,
            curCount: 0,
            curPage: 1,
            pageSize: 6,
        }
    },
    methods: {
        loadSupervisor(page, size) {
            const url = 'supervisors/onlineList';
            request.get(url, {
                params: {
                    pageNum: page,
                    pageSize: size,
                },
            }).then(res => {
                if (res.code == '1') {
                    this.superVisorArray = res.data.supervisors;
                    this.total = res.data.total;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '督导列表获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '督导列表获取错误: ' + err,
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
    },
    watch: {
        curPage(newPage) {
            this.loadSupervisor(newPage, this.pageSize);
        },
    },
    mounted() {
        this.loadSupervisor(this.curPage, this.pageSize);
    },
}

</script>
<style>
.supervisor-list {
    height: 150px;
    overflow-y: scroll;
    border-top: 1px solid var(--el-border-color);
}

.online-supervisor .el-row .el-col {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.online-supervisor .el-row .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.supervise-count {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.s-list-placeholder {
    align-items: center;
    text-align: center;
    justify-content: space-around;
    
    padding-top: 10%;
}

.supervise-name {
    display: inline-flex;
    margin-left: 2em;    
}

.supervise-state {
    display: inline-flex;
    margin: 5px 3px;
}

.supervise-card {
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-small);
    display: flex;
}
</style>