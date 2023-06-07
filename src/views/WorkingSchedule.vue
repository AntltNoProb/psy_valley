<template>
    <el-dialog v-model="dialogVisible" title="添加排班">
        <el-text type="info">
            为 {{ selectDate.getFullYear() }} 年 {{ selectDate.getMonth() + 1 }} 月
            {{ selectDate.getDate() }} 日
            (星期{{ '日一二三四五六'.charAt(selectDate.getDay()) }})
            添加{{ scheduleTypeLoc }}排班
        </el-text>
        <el-form class="select-form">
            <el-form-item :label="scheduleTypeLoc">
                <el-select v-model="newSchedule" placeholder="Please select a zone">
                    <el-option label="Zone No.1" value="shanghai" />
                    <el-option label="Zone No.2" value="beijing" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" 
                    @click="dialogVisible = false, onAdd(newSchedule)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-container class="calendar-container" style="margin: 20px">

        <el-col :span="18">
            <FullCalendar ref="calendar" class="calendar" :options="calendarOptions">
                <template #dayCellContent="arg">
                    <div style="width:100%; text-align: end;">{{ arg.dayNumberText }}</div>
                    <el-text type="primary">咨询师: {{ 3 }} 人</el-text><br/>
                    <el-text type="success">督导: {{ 3 }} 人</el-text>
                </template>
            </FullCalendar>
        </el-col>
        <el-col :span="6">
            <el-card class="calendar-panel" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <div>{{ timeStr }}</div>
                        <el-radio-group v-model="scheduleType">
                            <el-radio-button label="counselor">咨询师</el-radio-button>
                            <el-radio-button label="supervisor">督导</el-radio-button>
                        </el-radio-group>
                    </div>
                </template>
                <el-table :data="getCurrentList()" :show-header=false class="schedule-list">
                    <el-table-column prop="name" />
                    <el-table-column align="right">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="onRemove(scope.$index, scope.row)">
                                取消
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add-container">
                    <el-button class="schedule-add-button" type="primary" @click="dialogVisible = true"
                        :disabled="selectDate == null">
                        添加排班
                    </el-button>
                </div>
            </el-card>
        </el-col>
    </el-container>
</template>
<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interacationPlugin from '@fullcalendar/interaction'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'
export default {
    name: 'work-schedule',
    components: {
        FullCalendar,
    },
    data() {
        return {
            calendarOptions: {
                plugins: [interacationPlugin, dayGridPlugin],
                initialView: 'dayGridMonth',
                locale: "zh-cn",
                aspectRatio: 2,
                selectable: true,
                unselectAuto: false,
                showNonCurrentDates: false,
                selectAllow: this.beforeDateClick,
                select: this.onDateClick,
                customButtons: {
                    myTodayButton: {
                        text: '查看今天',
                        click: this.moveToToday
                    }
                },
                headerToolbar: {
                    right: 'prev,myTodayButton,next',
                    left: 'title',
                },
                eventDisplay: 'none',
                dayCellDidMount: function(arg) {
                    let ev = arg.el.querySelector('.fc-daygrid-day-events');
                    ev.className = 'day-events';
                }
            },
            scheduleType: "counselor",
            selectDate: null,
            // to modify
            scheduleData: [{
                date: 1,
                counselor: [{ name: 'd' }],
                supervisor: [{ name: 'd' }, { name: 'b' }, { name: 'f' }]
            }],
            dialogVisible: false,
            newSchedule: '',
        }
    },
    methods: {
        onDateClick(info) {
            if (this.selectDate != null &&
            (info.start.getFullYear() != this.selectDate.getFullYear() ||
            info.start.getMonth() != this.selectDate.getMonth())) {
                this.onMonthChange(info.start.getFullYear(), info.start.getMonth());
            }
            this.selectDate = info.start;
        },
        onMonthChange(year, month) {
            console.log(year, month);
        },
        beforeDateClick(info) {
            console.log('b');
            return Math.abs(info.start - info.end) <= 86400000;
        },
        onRemove(index) {
            // to modify
            this.scheduleData[0][this.scheduleType].splice(index, 1);
        },
        onAdd(s) {
            // to modify
            this.scheduleData[0][this.scheduleType].push({name:s});
        },
        moveToToday() {
            let capi = this.$refs.calendar.getApi();
            capi.select(new Date());
            capi.today();
        },
        getCurrentList() {
            if (this.selectDate == null) {
                return null;
            }
            let index = this.selectDate.getDate() - 1;
            if (index < 0 || index >= this.scheduleData.length) {
                return null;
            }
            return this.scheduleData[index][this.scheduleType];
        },
        loadMonthData(date) {
            const url='';
            request.post(url, date).then(res => {
                if (res.code == '1') {
                    console.log(res.data);
                } else {
                    ElMessage({
                        type: 'success',
                        message: '登录成功',
                    });
                }
            })
        },
        addData() {

        },
        removeData() {

        },
    },
    computed: {
        timeStr() {
            return this.selectDate ?
                this.selectDate.getMonth()+1 + '月' + this.selectDate.getDate() + '日' :
                '';
        },
        scheduleTypeLoc() {
            return this.scheduleType == 'counselor' ? '咨询师' : '督导';
        }
    }
}
</script>
<style>
.calendar-panel {
    margin: 10px;
}

.schedule-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}

.add-container {
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    color: var(--el-color-primary);
}
.select-form {
    margin-top: 20px;
}
.day-events {
    min-height: 0;
    margin-top: 10px;
}
</style>