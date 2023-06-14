<template>
    <el-card class="schedule-viewer">
        <FullCalendar ref="calendar" class="sc-calendar" :options="calendarOptions">
            <template #dayCellContent="arg">
                <div style="" >
                    <StarFilled 
                        style="width: 1em; height: 1em;" 
                        :style="'color: var(--el-color-' + (getScheduledOf(arg.date) ? 'success);':'info-light-7);')" 
                    />
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
// import request from '@/utils/request'
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
            schArray: [true,true,false,true],
        };
    },
    methods: {
        getScheduledOf(date) {
            return this.schArray[date.getDate() - 1];
        }
    },
}

</script>
<style>
.schedule-viewer {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}
.fc-daygrid-day-number {
    display:flex;
    justify-content: space-between;
    width: 100%;
}
</style>