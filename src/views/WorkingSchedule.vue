<template>
    <el-dialog v-model="dialogVisible" title="添加排班">
        <el-text type="info">
            为 {{ selectDate.getFullYear() }} 年 {{ selectDate.getMonth() + 1 }} 月
            {{ selectDate.getDate() }} 日 {{ scheduleAllWeek ? '及之后的' : '' }}
            星期{{ '日一二三四五六'.charAt(selectDate.getDay()) }}
            添加{{ scheduleTypeLoc }}排班
        </el-text>
        <el-form class="select-form" ref="addForm">
            <el-form-item :label="scheduleTypeLoc">
                <el-select v-model="newSchedule" multiple collapse-tags collapse-tags-tooltip filterable
                    :placeholder="'请选择' + scheduleTypeLoc">
                    <el-option v-for="(staff, index) in availableSchedule" :key="index"
                        :label="staff.w_name + '(' + staff.w_username + ')'" :value="index" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="hideAddWindow()">取消</el-button>
                <el-button type="primary" @click="onFormAdd(newSchedule)">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
    <el-container class="calendar-container" style="margin: 20px; margin-right:0px">

        <el-col :span="18" v-loading="isLoadingCal">
            <FullCalendar ref="calendar" class="calendar" :options="calendarOptions">
                <template #dayCellContent="arg">
                    <div style="width:100%; text-align: end;">{{ arg.dayNumberText }}</div>
                    <el-text type="primary">咨询师: {{ getStaffCount(arg.date.getDate(), 'counselor') }} 人</el-text><br />
                    <el-text type="success">督导: {{ getStaffCount(arg.date.getDate(), 'supervisor') }} 人</el-text>
                </template>
            </FullCalendar>
        </el-col>

        <el-col :span="6">
            <el-card class="calendar-panel" shadow="hover" v-loading="isLoadingCard">
                <template #header>
                    <div class="card-header">
                        <el-row>
                            <el-col :span="10">{{ timeStr }}</el-col>
                            <el-col :span="14" style="text-align: end;">
                                <el-switch v-model="scheduleAllWeek" size="small"
                                    style="--el-switch-on-color: var(--el-border-color); --el-switch-off-color: var(--el-color-primary);"
                                    inactive-text="仅添加单日排班" />
                            </el-col>
                        </el-row>
                        <el-radio-group v-model="scheduleType">
                            <el-radio-button label="counselor">咨询师</el-radio-button>
                            <el-radio-button label="supervisor">督导</el-radio-button>
                        </el-radio-group>
                    </div>
                </template>
                <el-table :data="getCurrentList()" :show-header=false class="schedule-list">
                    <el-table-column prop="w_name" />
                    <el-table-column align="right">
                        <template #default="scope">
                            <el-popconfirm title="确定要取消此排班吗?" confirm-button-text="确定" cancel-button-text="取消"
                                @confirm="onRemove(scope.$index, scope.row)">
                                <template #reference>
                                    <el-button size="small" type="danger" :disabled="getButtonDisabled()">
                                        取消排班
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add-container">
                    <el-button class="schedule-add-button" type="primary" @click="showAddWindow()"
                        :disabled="getButtonDisabled()">
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
    inject: ['reload'],
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
                    },
                    myPrev: {
                        icon: 'chevron-left',
                        click: () => this.moveMonth(true),
                    },
                    myNext: {
                        icon: 'chevron-right',
                        click: () => this.moveMonth(false),
                    },
                },
                headerToolbar: {
                    right: 'myPrev,myTodayButton,myNext',
                    left: 'title',
                },
                eventDisplay: 'none',
                dayCellDidMount: function (arg) {
                    let ev = arg.el.querySelector('.fc-daygrid-day-events');
                    ev.className = 'day-events';
                }
            },
            scheduleType: "counselor",
            viewMonth: new Date(),
            selectDate: new Date(),
            selectDateData: {},
            scheduleData: [],
            dialogVisible: false,
            newSchedule: '',
            availableSchedule: [],
            scheduleAllWeek: true,
            isLoadingCard: false,
            isLoadingCal: false,
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
            this.viewMonth = this.selectDate;
            this.generateDataCache();
        },
        onMonthChange(year, month) {
            this.loadMonthData(new Date(year, month));
        },
        beforeDateClick(info) {
            return Math.abs(info.start - info.end) <= 86400000;
        },
        onRemove(index) {
            console.log(this.selectDateData[this.scheduleType][index]);

            let stemp = this.scheduleType[0].toUpperCase() + this.scheduleType.slice(1);
            const url = 'arrange/delete' + stemp;
            this.isLoadingCard = true;
            request({
                url: url,
                method: 'post',
                params: {
                    date: this.getDateStrOf(this.selectDate),
                },
                data: this.selectDateData[this.scheduleType][index],
            }).then(res => {
                if (res.code == '1') {
                    ElMessage({
                        type: 'success',
                        message: '取消排班成功',
                    });
                    this.loadMonthData(this.selectDate, () => {
                        this.moveToDate(this.selectDate);
                        this.generateDataCache();
                    }, ()=> {
                        this.isLoadingCard = false;
                    });
                } else {
                    ElMessage({
                        type: 'success',
                        message: '取消排班失败, 服务器返回: ' + res.message,
                    });
                    this.isLoadingCard = false;
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '取消排班出错:' + err,
                });
                this.isLoadingCard = false;
            });
        },
        onFormAdd(data) {
            data.sort((a, b) => a - b);
            this.hideAddWindow();
            let stemp = this.scheduleType[0].toUpperCase() + this.scheduleType.slice(1);
            const url = 'arrange/insert' + stemp;

            this.isLoadingCard = true;

            request.post(url, {
                dates: this.getDateStrArr(),
                workers: data.map(i => this.availableSchedule[i]),
            }).then(res => {
                if (res.code == '1') {
                    ElMessage({
                        type: 'success',
                        message: '添加成功',
                    });
                    this.loadMonthData(this.selectDate, () => {
                        this.moveToDate(this.selectDate);
                        this.generateDataCache();
                    }, ()=> {
                        this.isLoadingCard = false;
                    });

                } else {
                    ElMessage({
                        type: 'success',
                        message: '添加失败, 服务器返回: ' + res.message,
                    });
                    this.isLoadingCard = false;
                }
                
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '添加失败:' + err,
                });
                this.isLoadingCard = false;
            });
        },
        moveToToday() {
            let capi = this.$refs.calendar.getApi();
            capi.today();
            capi.select(new Date());
        },
        moveToDate(date) {
            let capi = this.$refs.calendar.getApi();
            capi.gotoDate(date);
            capi.select(date);
        },
        moveMonth(isPrev) {
            let capi = this.$refs.calendar.getApi();
            if (isPrev) {
                capi.prev();
                this.viewMonth.setMonth(this.viewMonth.getMonth() - 1);
            } else {
                capi.next();
                this.viewMonth.setMonth(this.viewMonth.getMonth() + 1);
            }
            this.loadMonthData(this.viewMonth);
        },
        getCurrentList() {
            if (this.selectDateData == null) {
                return null;
            }
            return this.selectDateData[this.scheduleType];
        },
        getStaffCount(dateNum, scheduleType) {
            if (this.scheduleData[dateNum - 1]) {
                return this.scheduleData[dateNum - 1][scheduleType].length;
            }
            return 0;
        },
        loadMonthData(date, after, must) {
            const url = 'arrange/list';
            ElMessage(date.toDateString());
            this.isLoadingCal = true;
            request.get(url, {
                params: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                },
            }).then(res => {
                if (res.code == '1') {
                    this.scheduleData = res.data.arrangeData;
                    console.log(this.scheduleData);
                    if (after != null) {
                        after();
                    }
                } else {
                    ElMessage({
                        type: 'error',
                        message: '抓取信息失败: ' + res.message,
                    });
                }
                this.isLoadingCal = false;
                if (must != null) {
                    must();
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '抓取信息错误: ' + err,
                });
                this.isLoadingCal = false;
                if (must != null) {
                    must();
                }
            });
        },
        showAddWindow() {
            this.dialogVisible = true;
            this.checkAvailable(this.scheduleType);
        },
        hideAddWindow() {
            this.dialogVisible = false;
            this.newSchedule = [];
        },
        checkAvailable(scheduleType) {
            let stemp = scheduleType[0].toUpperCase() + scheduleType.slice(1);
            const url = 'arrange/available' + stemp;
            request.get(url, {
                params: {
                    date: this.getDateStrOf(this.selectDate),
                },
            }).then(res => {
                if (res.code == '1') {
                    this.availableSchedule = res.data['available' + stemp + 'Data'];
                } else {
                    ElMessage({
                        type: 'error',
                        message: '查询列表失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '查询列表出错: ' + err,
                })
            });
        },
        generateDataCache() {
            if (this.selectDate == null) {
                this.selectDateData = null;
                return;
            }
            let index = this.selectDate.getDate() - 1;
            if (index < 0 || index >= this.scheduleData.length) {
                this.selectDateData = null;
                return;
            }
            this.selectDateData = this.scheduleData[index];
        },
        // generateDateStr() {
        //     return [this.selectDate.getFullYear(),
        //     this.selectDate.getMonth() + 1,
        //     this.selectDate.getDate()
        //     ].join('-');
        // },
        getDateStrArr() {
            if (this.scheduleAllWeek) {
                let res = [];
                for (let date = new Date(this.selectDate);
                    date.getMonth() == this.selectDate.getMonth();
                    date.setDate(date.getDate() + 7)
                ) {
                    res.push(this.getDateStrOf(date));
                }
                return res;
            }
            return [this.getDateStrOf(this.selectDate)];
        },
        getDateStrOf(date) {
            let formatFunc = ((d) => (d < 10 ? '0' + d : '' + d));
            return [
                date.getFullYear(),
                formatFunc(date.getMonth() + 1),
                formatFunc(date.getDate()),
            ].join('-');
        },
        getButtonDisabled() {
            let user = sessionStorage.getItem('user');
            return this.selectDate == null ||
                !user || JSON.parse(user).authority != 'SystemManager'
        },
    },
    computed: {
        timeStr() {
            return this.selectDate ?
                (this.selectDate.getMonth() + 1) + '月' + this.selectDate.getDate() + '日' :
                '';
        },
        scheduleTypeLoc() {
            return this.scheduleType == 'counselor' ? '咨询师' : '督导';
        },

    },
    created() {
        this.loadMonthData(this.selectDate, () => {
            this.generateDataCache();
        });
    },
}
</script>
<style>
.calendar-panel {
    margin: 10px;
    margin-right: 0;
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