<template>
    <el-card class="week-chart">
        <div class="week-chart-container">
            <v-chart :option="weekOption" style="height:200px"></v-chart>
        </div>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            weekOption: {
                title: {
                    text: '本周咨询量',
                    x: 'center',
                    padding: [10,0,0,0],
                },
                xAxis: {
                    data: ['0', '1', '2', '3', '4', '5', '6'],
                },
                yAxis: {

                },
                grid: {
                    top: '8%',
                    left: '5%',
                    right: '5%',
                    bottom: '2%',
                    containLabel: true,
                },
                series: [
                    {
                        name: 'd',
                        type: 'line',
                        data: [23, 1, 12, 3, 5],
                    },
                ],
            },
        }
    },
}
</script>
<style>
.week-chart {
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0;
}

.week-chart .el-card__body {
    padding: 0;
}

.week-chart-container {
    min-height: 120px;
}
</style>