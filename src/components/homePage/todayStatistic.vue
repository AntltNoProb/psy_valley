<template>
    <el-card class="today-chart" shadow="hover">
        <div class="today-chart-container">
            <v-chart :option="todayOption" style="height:200px"></v-chart>
        </div>
    </el-card>
</template>
<script>
export default {
    data() {
        return {
            todayOption: {
                title: {
                    text: '今日咨询数',
                    x: 'center',
                    padding: [10,0,0,0],
                },
                xAxis: {
                    data: ['1', '2', '2', '2', '2'],
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
                        smooth: true,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#b3e19d' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#a0cfff' // 100% 处的颜色
                                }],
                            },
                        },
                    },
                ],
            },
        }
    },
}
</script>
<style>
.today-chart {
    align-items: center;
    text-align: center;
    justify-content: space-between;
    padding: 0;
}

.today-chart .el-card__body {
    padding: 0;
}

.today-chart-container {
    min-height: 120px;
}
</style>