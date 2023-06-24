<template>
    <el-card class="week-chart" shadow="hover">
        <div class="week-chart-container">
            <v-chart :option="weekOption" style="height:200px"></v-chart>
        </div>
    </el-card>
</template>
<script>
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
export default {
    data() {
        return {
            weekOption: {
                title: {
                    text: '本周咨询量',
                    x: 'center',
                    padding: [10, 0, 0, 0],
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    },
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
                        name: 'weekly',
                        type: 'line',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        tooltip: {
                            formatter: '{c}',
                        }
                    },
                ],

            },
            everyDayCount: [],

        };
    },
    methods: {
        loadWeekStatic() {
            this.weekOption.xAxis.data = this.getWeekDate();
            const url = 'records/everyDayCount';
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.everyDayCount = res.data.everyDayCount;
                    this.parseDayData();
                } else {
                    ElMessage({
                        type: 'error',
                        message: '周统计数据获取失败: ' + res.message,
                    });
                }

                }).catch(err => {
                    ElMessage({
                        type: 'error',
                        message: '周统计数据获取错误: ' + err,
                    });

            });
        },
        parseDayData() {
            let dst = this.getWeekDateOnly();
            let sei = [0, 0, 0, 0, 0, 0, 0];

            this.everyDayCount.forEach((o) => {
                let i = dst.indexOf(o.everyTime);
                if (i != -1) {
                    sei[i] = o.everyCount;
                }
            });
            this.weekOption.series[0].data = sei;

        },
        getWeekDate() {
            let res = [];
            let d = new Date();
            for (let i = 0; i < 7; ++i) {
                res.unshift(this.dateFormatSlash(d));
                d.setDate(d.getDate() - 1);
            }
            return res;
        },
        getWeekDateOnly() {
            let res = [];
            let d = new Date();
            for (let i = 0; i < 7; ++i) {
                res.unshift(this.dateNumFormat(d.getDate()));
                d.setDate(d.getDate() - 1);
            }
            return res;
        },
        dateNumFormat(d) {
            return d < 10 ? '0' + d : '' + d;
        },
        dateFormatSlash(date) {
            return [
                date.getFullYear(),
                this.dateNumFormat(date.getMonth() + 1),
                this.dateNumFormat(date.getDate()),
            ].join('/');
        },
    },
    mounted() {
        this.loadWeekStatic();
        console.log(this.weekOption);
    }
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