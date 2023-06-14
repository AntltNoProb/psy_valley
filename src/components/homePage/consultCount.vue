<template>
    <el-card class="consult-data" :body-style="{ height:'100%', width: '100%' }">
        <el-row :gutter="10" type="flex" align="middle" class="consult-row">
            <el-col :span="eachSpan">
                <el-text class="consult-card-header">今日咨询数</el-text>
                <el-text class="consult-card-main" size="large" tag="b">{{ count }}</el-text>
            </el-col>
            <el-col :span="eachSpan">
                <el-text class="consult-card-header">
                    今日咨询时长
                </el-text>
                <el-text class="consult-card-main" size="large" tag="b">{{ timeStr }}</el-text>
            </el-col>
            <el-col :span="eachSpan" v-if="showCurrent">
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
        count: Number,
        time: Date,
        showCurrent: {
            type:Boolean,
            default:false
        },
        curCount: Number,
    }, 
    computed: {
        timeStr() {
            let time = this.time;
            let timeCompl = ((s) => s < 10? '0'+s: ''+s);
            return `${timeCompl(time.getHours())}:${timeCompl(time.getMinutes())}:${timeCompl(time.getSeconds())}`;
        }
    }, 
    data() {
        return {
            eachSpan: 12,
        }
    },
    mounted() {
        this.eachSpan = this.showCurrent? 8: 12;
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