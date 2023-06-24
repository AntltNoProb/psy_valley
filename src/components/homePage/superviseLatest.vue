<template>
    <el-dialog title="历史记录详情" v-model="dialogFormVisible">
            <div v-for="(itemc,indexc) in messageList" :key="indexc">
                <el-row gutter="10" v-if = "itemc.From_Account === senderID && itemc.MsgBody[0].MsgContent.Text !== 'TERMINATE' " type="flex" justify="start">
                    <el-col span="4">
                        <el-avatar shape="square" :size="50" :src="headTwoUrl"/>
                    </el-col>
                    <el-col span="8" >{{"咨询师"+senderName}}</el-col>
                    <div class="tip-left" v-if="itemc.MsgBody[0].MsgType == 'TIMTextElem'">{{itemc.MsgBody[0].MsgContent.Text}}</div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMSoundElem'"><m-audio :src="itemc.MsgBody[0].MsgContent.Url"/></div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMImageElem'" >
                        <a :href="itemc.MsgBody[0].MsgContent.ImageInfoArray[0].URL" target="_blank">查看详情</a>
                    </div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMMergerElem'">
                        <el-button size="large">{{itemc.MsgBody[0].MsgContent.Title}}</el-button>
                    </div>
                </el-row>
                <el-row gutter="10" v-else-if = "itemc.MsgBody[0].MsgContent.Text !== 'TERMINATE'" type="flex" justify="end">
                    <div class="tip-right">{{itemc.MsgBody[0].MsgContent.Text}}</div>
                    <el-col span="8">{{"督导"+myname}}</el-col>
                    <el-col span="4"><el-avatar shape="square" :size="50" :src="headOneUrl" /></el-col>
                </el-row>
            </div>
        </el-dialog>

    <el-card class="sup-latest-table" shadow="hover" :body-style="{padding: '0px'}">
        <template #header>
            <div class="sup-latest-card-header">
                <el-text>{{ headerText }}</el-text>
                <el-button class="all-sup-button" text type="success" @click="$router.push('dialog-record')">
                    查看全部 <el-icon><ArrowRight /></el-icon>
                </el-button>
            </div>
        </template>
        <el-table :data="tableData" 
            border stripe 
            style="width: 100%" 
            @selection-change="handleSelectionChange"
            :header-cell-style="{
                'background-color': 'var(--el-color-success-light-9)', }"
        >
            <el-table-column prop="c_name" label="咨询师" />
            <el-table-column prop="duration" label="求助时长" />
            <el-table-column prop="startDate" label="求助日期" sortable />

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" 
                        @click="handleDetail(scope.row.s_name, 
                            scope.row.c_name, scope.row.s_username, 
                            scope.row.c_username, scope.row.duration, 
                            scope.row.startDate)"
                        size="small"
                    >
                        查看详情
                    </el-button>
                    <el-popconfirm title="确认要导出吗?" 
                        @confirm="handleExport(scope.row.s_name, 
                            scope.row.c_name, scope.row.s_username, 
                            scope.row.c_username, scope.row.duration, 
                            scope.row.startDate)"
                    >
                        <template #reference>
                            <el-button size="small">导出</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>
<script>
import request from "@/utils/request";
import axios from "axios";
import { ElMessage } from "element-plus";
import { ArrowRight } from "@element-plus/icons";
export default {
    props: {
        headerText: {
            type: String,
            default: '最近完成的求助',
        }
    },
    components: {
        ArrowRight,
    },
    data() {
        return {
            param: {
                startTime: '',
                endTime: '',
                date: '',
            },
            messageList: [],
            form: {},
            tableData: [],
            user: {},
            dialogFormVisible: false,
        };
    },
    methods: {
        loadLatest() {
            const url = "/assist/currentAssists/";
            request.get(url, {
                params: {
                    username: this.user.username,
                },
            }).then(res => {
                if (res.code == '1') {
                    this.tableData = res.data.assists;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '最近求助记录获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '最近求助记录获取错误: ' + err,
                });
            });
        },
        timeToTimestamp(time){
            let timestamp = Date.parse(new Date(time).toString());
            timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
            return timestamp;
            //2021-11-18 22:14:24的时间戳为：1637244864707
        },

        hmsToSecondsOnly(str) {
            var p = str.split(':'),
                s = 0, m = 1;
            while (p.length > 0) {
                s += m * parseInt(p.pop(), 10);
                m *= 60;
            }
            return s;
        },
        handleDetail(myname,senderName,phoneNum,username,duration,startime){
            this.myname = myname
            this.senderName = senderName
            this.myID = username
            this.senderID = phoneNum
            axios({
                method:'post',
                url:'/IM',
                params:{
                    sdkappid: 1400813651,
                    identifier: "administrator",
                    usersig:"eJwtzFsLgjAcBfDvsueQTTdv0EOgXcAuUJHtbbBlf0Jdc8Qi*u6Z*nh*53A*6FQcvZcyKEW*h9FsyCBVY*EGAwtZQwOdNcK2Zhp08iG0BolSQjGOSRAyMjbKaTCqd8aYjzEe1UL9tzBmlPoJodMLVP1-UkarZbnmrr0XWe40r0luo8vBmTcE2U7z-XazeJ65qa5z9P0BWoQ1QA__",
                    random:2,
                    contenttype:"json",
                },
                data:{
                    "Operator_Account": username,
                    "Peer_Account" : phoneNum,
                    "MaxCnt": 100,
                    "MinTime": this.timeToTimestamp(startime),
                    "MaxTime": this.timeToTimestamp(startime)+this.hmsToSecondsOnly(duration),
                },
            }).then(res => {
                this.dialogFormVisible= true,
                this.totalMsg = res.data.MsgCnt
                this.messageList = [...res.data.MsgList].reverse()
                console.log(this.messageList,"klee")
                this.dialogFormVisible = true
            })
        },
        timestampToTime(timestamp) {
            var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
            var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
            var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
            return Y+M+D+h+m+s;
        },
        handleExport(myname,senderName,phoneNum,username,duration,startime){
            this.myname = myname
            this.senderName = senderName
            this.myID = username
            this.senderID = phoneNum
            axios({
                method:'post',
                url:'/IM',
                params:{
                    sdkappid: 1400813651,
                    identifier: "administrator",
                    usersig:"eJwtzFsLgjAcBfDvsueQTTdv0EOgXcAuUJHtbbBlf0Jdc8Qi*u6Z*nh*53A*6FQcvZcyKEW*h9FsyCBVY*EGAwtZQwOdNcK2Zhp08iG0BolSQjGOSRAyMjbKaTCqd8aYjzEe1UL9tzBmlPoJodMLVP1-UkarZbnmrr0XWe40r0luo8vBmTcE2U7z-XazeJ65qa5z9P0BWoQ1QA__",
                    random:1,
                    contenttype:"json",
                },
                data:{
                    "Operator_Account": username,
                    "Peer_Account" : phoneNum,
                    "MaxCnt": 100,
                    "MinTime": this.timeToTimestamp(startime),
                    "MaxTime": this.timeToTimestamp(startime)+this.hmsToSecondsOnly(duration),
                },
            }).then(res => {
                this.totalMsg = res.data.MsgCnt
                console.log(res,'zm')
                this.messageList = [...res.data.MsgList].reverse()

                console.log(this.messageList,"klee")

                let ret = []

                for(var cnt = 0 ; cnt < this.totalMsg; cnt++){
                    let message = {}
                    if(this.messageList[cnt].MsgBody[0].MsgType == 'TIMTextElem'){
                        if(this.messageList[cnt].From_Account !== this.senderID){
                            message['counselorName'] = this.senderName
                            message['time'] = this.timestampToTime(this.messageList[cnt].MsgClientTime)
                            message['content'] = this.messageList[cnt].MsgBody[0].MsgContent.Text
                        }else{
                            message['supervisorName'] = this.myname
                            message['time'] = this.timestampToTime(this.messageList[cnt].MsgClientTime)
                            message['content'] = this.messageList[cnt].MsgBody[0].MsgContent.Text
                        }
                    }else{
                        if(this.messageList[cnt].From_Account == this.senderID){
                            message['counselorName'] = this.senderName
                            message['time'] = this.timestampToTime(this.messageList[cnt].MsgClientTime)
                            message['content'] = "非文本类型消息"
                        }else{
                            message['supervisorName'] = this.myname
                            message['time'] = this.timestampToTime(this.messageList[cnt].MsgClientTime)
                            message['content'] = "非文本类型消息"
                        }
                    }
                    ret.push(message)
                }

                let jsonStr = JSON.stringify(ret, null, 2);

                let blob = new Blob([jsonStr], {type: "text/plain"});

                // 创建一个指向blob的url
                let url = URL.createObjectURL(blob);

                // 创建一个a标签，并设置href为我们刚才创建的url
                let a = document.createElement('a');
                a.href = url;
                a.download = 'history.txt'; // 设置下载的文件名
                // 模拟用户点击这个a标签，这会触发下载
                a.click();
            })
        },
    },
    mounted() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.loadLatest();
    },
}

</script>
<style scoped>
.sup-latest-table {
    align-items: center;
    text-align: center;
    justify-content: space-between;
    height: 100%;
}

.sup-latest-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/*左三角*/
.tip-left {
    margin: 20px;
    padding: 5px;
    min-width: 50px;
    min-height: 40px;
    border: 2px solid #f99;
    position: relative;
    background-color: #FFF;
    /*设置圆角*/
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    word-wrap: break-word;
}

.tip-left:before, .tip-left:after {
    content: "";
    display: block;
    border-width: 15px;
    position: absolute;
    left: -30px;
    top: 20px;
    border-style: dashed solid solid dashed;
    border-color: transparent #f99 transparent transparent;
    font-size: 0;
    line-height: 0;
}

.tip-left:after {
    left: -27px;
    border-color: transparent #FFF transparent transparent;
}

/*右三角*/
.tip-right {
    margin: 20px;
    padding: 5px;
    min-width: 50px;
    min-height: 40px;
    border: 2px solid #0ff;
    position: relative;
    background-color: #FFF;
    /*设置圆角*/
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    word-wrap: break-word;
}

.tip-right:before, .tip-right:after {
    content: "";
    display: block;
    border-width: 15px;
    position: absolute;
    right: -30px;
    top: 20px;
    border-style: dashed solid solid dashed;
    border-color: transparent transparent transparent #0ff;
    font-size: 0;
    line-height: 0;
}

.tip-right:after {
    right: -27px;
    border-color: transparent transparent transparent #FFF;
}
</style>
<style>
.sup-latest-table .el-card__header {
    padding: 9px 20px;
}
</style>