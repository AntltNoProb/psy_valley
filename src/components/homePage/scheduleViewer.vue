<template>
    <el-card class="schedule-viewer">
        <FullCalendar ref="calendar" class="sc-calendar" :options="calendarOptions">
            <template #dayCellContent="arg">
                <div style="">
                    <StarFilled style="width: 1em; height: 1em;"
                        :style="'color: var(--el-color-' + (getScheduledOf(arg.date) ? 'success);' : 'info-light-7);')" />
                </div>

                <div style="width: 2em;text-align: end;">{{ arg.date.getDate() }}</div>
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
    data() {
        return {
            calendarOptions: {
                plugins: [dayGridPlugin],
                initialView: 'dayGridMonth',
                locale: "zh-cn",
                aspectRatio: 2,
                showNonCurrentDates: false,
                selectAllow: this.beforeDateClick,
                select: this.onDateClick,
                eventDisplay: 'none',
                headerToolbar: false,
                dayCellDidMount: function (arg) {
                    let ev = arg.el.querySelector('.fc-daygrid-day-events');
                    ev.className = 'day-events';
                }
            },
            dateArray: [],
        };
    },
    methods: {
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
    },
    mounted() {
        this.loadCounselorSchedule();
    },
}

</script>
<style>
.schedule-viewer {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.schedule-viewer .fc-daygrid-day-number {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
</style>