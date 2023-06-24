<template>
    <el-card class="schedule-dialog" v-loading="schLoading">
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
import interacationPlugin from '@fullcalendar/interaction'
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
        user: {
            type: Object,
            default: null,
        }
    },
    data() {
        let that = this;
        return {
            calendarOptions: {
                plugins: [interacationPlugin, dayGridPlugin],
                initialView: 'dayGridMonth',
                locale: "zh-cn",
                aspectRatio: 2,
                showNonCurrentDates: false,
                // selectable: true,
                // selectAllow: this.beforeDateClick,
                // select: this.onDateClick,
                dateClick: this.onDateClickSingle,
                eventDisplay: 'none',
                headerToolbar: false,
                dayCellDidMount: function (arg) {
                    let ev = arg.el.querySelector('.fc-daygrid-day-events');
                    ev.className = 'day-events';
                    
                    if (that.getIsPassedDate(arg.date)) {
                        arg.el.className += ' schedule-dialog-content-pass';
                    } else {
                        arg.el.className += ' schedule-dialog-content-next';
                    }
                    
                }
            },
            dateArr: [],
            schLoading: false,
        };
    },
    methods: {
        onDateClick(info) {
            if (this.selectDate != null &&
                (info.start.getFullYear() != this.selectDate.getFullYear() ||
                    info.start.getMonth() != this.selectDate.getMonth())) {
                this.onMonthChange(info.start.getFullYear(), info.start.getMonth());
            }
            this.selectDate = info.start;
            this.viewMonth = this.selectDate;
            this.generateDataCache();
        },
        beforeDateClick(info) {
            return Math.abs(info.start - info.end) <= 86400000;
        },
        onDateClickSingle(info) {
            if (!this.getIsPassedDate(info.date)) {
                this.changeStateOf(info.date);
            }
        },
        getIsPassedDate(date) {
            return date.getDate() < new Date().getDate();
        },
        getScheduledOf(date) {
            return this.dateArr[date.getDate() - 1] == true;
        },
        changeStateOf(date) {
            this.dateArr[date.getDate() - 1] = !this.dateArr[date.getDate() - 1];
        },
        loadCounselorSchedule() {
            const url = 'arrange/schedule';
            this.schLoading = true;
            request.get(url, {
                params: {
                    name: this.user.username,
                },
            }).then(res => {
                if (res.code == '1') {
                    let dateArray = res.data.dateList;
                    this.dateArr = this.schArray(dateArray);
                } else {
                    ElMessage({
                        type: 'error',
                        message: '排班数据获取失败: ' + res.message,
                    });
                }
                this.schLoading = false;
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '排班数据获取错误: ' + err,
                });
                this.schLoading = false;
            });
        },
        schArray(raw) {
            let res = [];
            for (let dateStr of raw) {
                let dateArr = dateStr.split('-');
                if (dateArr[2] && !isNaN(parseInt(dateArr[2]))) {
                    res[parseInt(dateArr[2]) - 1] = true;
                }
            }
            return res;
        },
        toRaw() {
            let res = [];
            let head = this.getRawStrHead();
            for (let i=0;i<this.dateArr.length;i++) {
                if (this.dateArr[i]) {
                    res.push(head + this.dateFormatFunc(i+1));
                }
            }
            return res;
        },
        loadRow() {
            this.loadCounselorSchedule();
        },
        getRawStrHead() {
            let date = new Date();
            return date.getFullYear() + '-' + this.dateFormatFunc(date.getMonth()+1) + '-';
        },
        dateFormatFunc(d) {
            return d < 10 ? '0' + d : '' + d;
        },
    },
    computed: {
        
    },
    mounted() {
        this.loadCounselorSchedule();
    },
}

</script>
<style>
.schedule-dialog {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.schedule-dialog .fc-daygrid-day-number {
    display: flex;
    justify-content: end;
    width: 100%;
    /* padding: 0px; */
}

.schedule-dialog-content-pass {
    background-color: var(--el-fill-color-dark);
    /* background-color: #000; */
    color: var(--el-text-color-disabled);
    cursor: default;
    user-select: none;
}
.schedule-dialog-content-next {
    cursor: pointer;
    user-select: none;
    /* transition: 0.2s ease background-color; */
}
.schedule-dialog-content-next:active {
    background-color: var(--el-color-success-light-9);
}
</style>
<style scoped>
</style>