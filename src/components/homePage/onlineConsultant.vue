<template>
    <el-card class="online-consultant" shadow="hover">
        <el-row class="outer-row" :gutter="10" type="flex" align="middle">
            <el-col :span="18">
                <el-text class="consult-card-header">在线咨询师</el-text>
                <div class="consultant-list">
                    <div v-if="consultantArray.length <= 0" class="c-list-placeholder">
                        <el-text class="c-list-placeholder-text" type="info">暂无在线咨询师</el-text>
                    </div>
                    <el-row>
                        <el-tooltip  v-for="(consultant, index) in consultantArray" :key="index">
                            <template #content>
                                <span>{{ consultant.name }}</span>
                            </template>
                            <el-col :span="8" class="consult-card">
                                <el-text class="consult-name" truncated>{{ consultant.name }}</el-text>
                                <el-tag 
                                    class="consult-state"
                                    :type="consultant.busy ? 'danger' : 'success'"
                                >
                                    {{ consultant.busy ? '忙碌' : '空闲' }}
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
            <el-col class="consult-count" :span="6">
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
        userBind: {
            type: Boolean,
            default: false,
        },
        pageSize: {
            type: Number,
            default: 12,
        }
    },
    data() {
        return {
            consultantArray: [],
            total: 0,
            curCount: 0,
            curPage: 1,
            user: {},
        };
    },
    methods: {
        loadConsultant(page, size) {

            const url = 'counselors/onlineList';
            const uurl = 'supervisors/counselorList/' + this.user.username;

            request.get(this.userBind?uurl:url, {
                params: {
                    pageNum: page,
                    pageSize: size,
                },
            }).then(res => {
                if (res.code == '1') {
                    this.consultantArray = res.data.counselors;
                    this.total = res.data.total;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '咨询师列表获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '咨询师列表获取错误: ' + err,
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
            this.loadConsultant(newPage, this.pageSize);
        },
    },
    mounted() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.loadConsultant(this.curPage, this.pageSize);
    }
}
</script>
<style>
.consultant-list {
    min-height: 150px;
    border-top: 1px solid var(--el-border-color);
}

.online-consultant .el-row .el-col {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.online-consultant .el-row .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.consult-count {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.c-list-placeholder {
    align-items: center;
    text-align: center;
    justify-content: space-around;
    height: 100%;
    display: flex;
    padding-top: 10%;
}

.c-list-placeholder-text {
    height:100%;
}

.consult-name {
    display: inline-flex;
    margin-left: 2px;    
}

.consult-state {
    display: inline-flex;
    margin: 5px 3px;
}

.consult-card {
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-small);
    display: flex;
}
</style>