<template>
    <el-card class="consult-data" :body-style="{ height: '100%', width: '100%' }" shadow="hover">
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
export default {
    props: {
        showCurrent: {
            type: Boolean,
            default: false,
        },
        timeStr: {
            type: String,
            default: '00:00:00',
        },
        count: {
            type: Number,
            default: 0,
        },
        curCount: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            eachSpan: 12,
        }
    },
    mounted() {
        this.eachSpan = this.showCurrent ? 8 : 12;
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
    font-size: 1.5rem;
}
</style>