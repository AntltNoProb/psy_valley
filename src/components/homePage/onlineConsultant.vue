<template>
    <el-card class="online-consultant">
        <el-row class="outer-row" :gutter="10">
            <el-col :span="18">
                <el-text class="consult-card-header">在线咨询师</el-text>
                <el-divider />
                <el-row class="consultant-list">
                    <div class="list-placeholder">
                        <el-text type="info">暂无在线咨询师</el-text>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="6">
                <el-statistic title="正在进行的咨询数" :value="35536" />
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
export default {
    props: {
        
        curCount: Number,
    }, 
    computed: {
        
    }
}

</script>
<style>
.consultant-list {
    min-height: 90px;
}
.online-consultant .el-row .el-col {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.online-consultant .el-row .el-col:not(:last-child) {
    border-right: 1px solid var(--el-border-color);
}

.list-placeholder {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}
</style>