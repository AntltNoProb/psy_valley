<template>
    <el-card class="schedule-viewer" shadow="hover" :body-style="{padding: '0 20px', height:'70%'}">
        <template #header>
            <div class="schedule-viewer-card-header">
                <div class="card-header-left">
                    <el-text class="schedule-view-header-text" type="default">{{thisMonth}}</el-text>
                    <el-text> 本月共 {{ thisMonthTotal }} 天有排班</el-text>
                </div>
                <el-tag :type="todayWork?'success':'info'">今日{{ todayWork?'有':'无' }}排班</el-tag>
            </div>
        </template>
        <FullCalendar ref="calendar" class="sc-calendar" :options="calendarOptions">
            <template #dayCellContent="arg">
                <div class="day-box" 
                    style="width:100%; height: 100%;display:flex" 
                >
                <div >
                    <StarFilled style="width: 1.3em; height: 1.3em;"
                        :style="'color: var(--el-color-' + (getScheduledOf(arg.date) ? 'success);' : 'info-light-7);')" />
                
                </div>
                <div style="width: 2em;text-align: end;">{{ arg.date.getDate() }}</div>
                </div>
            </template>
        </FullCalendar>
    </el-card>
</template>
<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import {
    StarFilled,
} from '@element-plus/icons'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
export default {
    components: {
        FullCalendar,
        StarFilled,
    },
    props: {
        small: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        let that = this;
        return {
            calendarOptions: {
                plugins: [dayGridPlugin],
                initialView: 'dayGridMonth',
                locale: "zh-cn",
                aspectRatio: this.small?3:2,
                height: '100%',
                showNonCurrentDates: false,
                selectAllow: this.beforeDateClick,
                select: this.onDateClick,
                eventDisplay: 'none',
                headerToolbar: false,
                dayCellDidMount: function (arg) {
                    let ev = arg.el.querySelector('.fc-daygrid-day-events');
                    ev.className = 'day-events';
                    
                    if (that.getIsPassedDate(arg.date)) {
                        arg.el.className += ' schedule-viewer-content-pass';
                    }
                    
                }
            },
            dateArray: [],
        };
    },
    methods: {
        getIsPassedDate(date) {
            return date.getDate() < new Date().getDate();
        },
        getScheduledOf(date) {
            return this.schArray[date.getDate() - 1] == true;
        },
        loadCounselorSchedule() {
            let user = sessionStorage.getItem('user');
            if (!user) {
                ElMessage({
                    type: 'error',
                    message: '用户数据获取失败, 请重新登陆'
                });
                return;
            }
            const url = 'arrange/schedule';
            request.get(url, {
                params: {
                    name: JSON.parse(user).username,
                },
            }).then(res => {
                if (res.code == '1') {
                    this.dateArray = res.data.dateList;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '排班数据获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '排班数据获取错误: ' + err,
                });
            });
        }
    },
    computed: {
        schArray() {
            let res = [];
            for (let dateStr of this.dateArray) {
                let dateArr = dateStr.split('-');
                if (dateArr[2] && !isNaN(parseInt(dateArr[2]))) {
                    res[parseInt(dateArr[2]) - 1] = true;
                }
            }
            return res;
        },
        thisMonth() {
            let date = new Date();
            return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
        },
        thisMonthTotal() {
            return this.dateArray.length;
        },
        todayWork() {
            return this.getScheduledOf(new Date());
        },
    },
    mounted() {
        this.loadCounselorSchedule();
    },
}

</script>
<style>
.schedule-viewer {
    height: 100%;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.schedule-viewer .fc-daygrid-day-number {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    /* padding: 0px; */
}

.schedule-viewer-content-pass {
    background-color: var(--el-fill-color-dark);
    /* background-color: #000; */
    color: var(--el-text-color-disabled);
    cursor: default;
    user-select: none;
}
.schedule-viewer .el-card__header {
    padding: 10px 20px 2px;
}
.schedule-view-header-text {
    color: black;
    font-weight: 1000;
    font-size: 1.6rem;
    padding: 0;
    display:block;
    
}
.sc-calendar {
    height: 100%;
}
</style>
<style scoped>
.schedule-viewer-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.card-header-left {
    text-align: start;  
}
</style>