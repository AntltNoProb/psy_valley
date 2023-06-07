<template>
    <el-card class="online-supervisor">
        <el-row class="outer-row" :gutter="10" type="flex" align="middle">
            <el-col :span="18">
                <el-text class="supervise-card-header">在线督导</el-text>
                <div class="supervisor-list">
                    <div v-if="superVisorArray.length <= 0" class="list-placeholder">
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
            </el-col>
            <el-col class="supervise-count" :span="6">
                <el-statistic title="正在进行的咨询数" :value="curCount" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    props: {
        superVisorArray: {
            type: Array,
            default() {
                return [
                    { name: 'sd', busy: true },
                    { name: 's', busy: true },
                    { name: '1', busy: false },
                    { name: '2asdfasdfasdfasdf', busy: false },
                    { name: '3', busy: true },
                ];
            }
        },
        curCount: {
            type: Number,
            default: 0,
        },
    },
    data() {

    }
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

.list-placeholder {
    align-items: center;
    text-align: center;
    justify-content: space-between;
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