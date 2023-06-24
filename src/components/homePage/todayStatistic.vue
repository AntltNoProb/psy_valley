<template>
    <el-card class="today-chart" shadow="hover">
        <div class="today-chart-container">
            <v-chart :option="todayOption" style="height:200px"></v-chart>
        </div>
    </el-card>
</template>
<script>
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
export default {
    data() {
        return {
            todayOption: {
                title: {
                    text: '今日咨询数',
                    x: 'center',
                    padding: [10, 0, 0, 0],
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    boundaryGap: false,
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
                tooltip: {
                    show: true,
                    trigger: 'item',
                },
                series: [
                    {
                        name: 'today',
                        type: 'line',
                        tooltip: {
                            formatter: '{c}',
                        },
                        data: [
                            0,0,0,0,0,0,
                            0,0,0,0,0,0,
                            0,0,0,0,0,0,
                            0,0,0,0,0,0,0],
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
            everyHourCount: [],
        }
    },
    methods: {
        loadTodayStatic() {
            this.todayOption.xAxis.data = this.getTodayHour();
            const url = 'records/everyHourCount';
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.everyHourCount = res.data.everyHourCount;
                    this.parseHourData();
                } else {
                    ElMessage({
                        type: 'error',
                        message: '今日统计数据获取失败: ' + res.message,
                    });
                }

            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '今日统计数据获取错误: ' + err,
                });

            });
        },
        parseHourData() {
            let dst = this.getTodayHourOnly();
            let sei = [
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0
            ];

            this.everyHourCount.forEach((o) => {
                let i = dst.indexOf(o.everyTime);
                if (i != -1) {
                    sei[i] = o.everyCount;
                }
            });
            this.todayOption.series[0].data = sei;

        },
        getTodayHour() {
            let res = [];
            for (let i=0; i<=24;i++) {
                res.push(this.dateNumFormat(i) + ':00');
            }
            return res;
        },
        getTodayHourOnly() {
            let res = [];
            for (let i=0; i< 24;i++) {
                res.push(this.dateNumFormat(i));
            }
            return res;
        },
        dateNumFormat(d) {
            return d < 10 ? '0' + d : '' + d;
        },
    },
    mounted() {
        this.loadTodayStatic();
        console.log(this.todayOption);
    }
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