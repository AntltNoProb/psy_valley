<template>
    <div style="padding: 10px">
        <el-dialog title="历史记录详情" v-model="dialogFormVisible">
            <div v-for="(itemc,indexc) in messageList" :key="indexc">
                <el-row gutter="10" v-if = "itemc.From_Account === senderID && itemc.MsgBody[0].MsgType !== 'TIMCustomElem' " type="flex" justify="start">
                    <el-col span="4">
                        <el-avatar shape="square" :size="50" :src="headTwoUrl"/>
                    </el-col>
                    <el-col span="8" >{{senderName}}</el-col>
                    <div class="tip-left" v-if="itemc.MsgBody[0].MsgType == 'TIMTextElem'">{{itemc.MsgBody[0].MsgContent.Text}}</div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMSoundElem'"><m-audio :src="itemc.MsgBody[0].MsgContent.Url"/></div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMImageElem'" >
                        <a :href="itemc.MsgBody[0].MsgContent.ImageInfoArray[0].URL" target="_blank">查看详情</a>
                    </div>
                    <div class="tip-left" v-else-if="itemc.MsgBody[0].MsgType == 'TIMMergerElem'">
                        <el-button size="large">{{itemc.MsgBody[0].MsgContent.Title}}</el-button>
                    </div>
                </el-row>
                <el-row gutter="10" v-else-if = "itemc.MsgBody[0].MsgType !== 'TIMCustomElem'" type="flex" justify="end">
                    <div class="tip-right">{{itemc.MsgBody[0].MsgContent.Text}}</div>
                    <el-col span="8">{{myname}}</el-col>
                    <el-col span="4"><el-avatar shape="square" :size="50" :src="headOneUrl" /></el-col>
                </el-row>
            </div>
        </el-dialog>

        <div style="margin: 10px 0">
            <el-input v-model="searchVisitor" placeholder="请输入访客姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询访客姓名</el-button>
            <el-input v-model="searchCounselor"  placeholder="请输入咨询师姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询咨询师姓名</el-button>
            <el-config-provider>
                <el-date-picker
                    style="margin-left: 7px"
                    v-model="param.date"
                    type="daterange"
                    placeholder="选择日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="dateFormat"
                />
            </el-config-provider>
            <el-popconfirm title="确认要全部导出吗?" @confirm="exportAll">
                <template #reference>
                    <el-button type="danger" style="float:right">全部导出咨询记录</el-button>
                </template>
            </el-popconfirm>
        </div>
        <el-table :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="c_name" label="咨询师"/>
            <el-table-column prop="v_name" label="访客" />
            <el-table-column prop="duration" label="咨询时长" />
            <el-table-column prop="level" label="咨询评价" sortable/>
            <el-table-column prop="starttime" label="咨询日期"  sortable/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="handleDetail(scope.row.c_name, scope.row.v_name,scope.row.pno,scope.row.c_username,scope.row.duration, scope.row.starttime)">查看详情</el-button>
                    <el-popconfirm title="确认要导出吗?" @confirm="HandleExport(scope.row.id)">
                        <template #reference>
                            <el-button size="small">导出</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-pagination
                    v-model:currentPage="currentPage"
                    :page-size="10"
                    layout="prev, pager, next, jumper"
                    :total="total"
                    @current-change="handleCurrentChange"
                    background >
            </el-pagination>
        </div>

    </div>
</template>
<script>
import request from "../utils/request";
import {ElMessage} from "element-plus";
import axios from "axios";
// import {IM_APP_ID} from "@/IMconfig/im";
export default {
    name: 'consult-record',
    components: {

    },
    data() {
        return {

            dialogFormVisible: false,
            senderID:'',
            senderName:'',
            myID:'',
            myname:'',
            param: {
                startTime: '',
                endTime: '',
                date: '',
            },
            totalMsg:0,
            messageList:[],
            form:{},
            searchVisitor: '',
            searchCounselor:'',
            currentPage: 1 ,
            total: 10 ,
            tableData: [],
            multipleSelection:[],
        }
    },
    created(){
        this.load()
    },
    mounted(){
        document.title='查询记录'
    },
    methods :{

        dateFormat(picker) {
            this.param.startTime = picker[0].toString()
            this.param.endTime = picker[1].toString()
            this.load()
        },

        // 北京时间：2021-11-18 22:14:24
        /* 时间yyyy-MM-dd HH:mm:ss转为时间戳 */
        timeToTimestamp(time){
            let timestamp = Date.parse(new Date(time).toString());
            timestamp = timestamp / 1000; //时间戳为13位需除1000，时间戳为13位的话不需除1000
            console.log(time + "的时间戳为：" + timestamp);
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
                this.messageList = [...res.data.MsgList].reverse()
                console.log(this.messageList,"klee")
                this.dialogFormVisible = true
            })
        },
        load(){
            request.get("/records/list",{
                params:{
                    pageNum: this.currentPage,
                    pageSize:10,
                    visitorName: this.searchVisitor,
                    counselorName: this.searchCounselor,
                    startDate: this.param.startTime,
                    endDate: this.param.endTime,
                },
            }).then(res => {
                console.log(res)
                this.tableData=res.data.records
                this.total = res.data.total
            })
        },
        exportAll(){//等待处理
            if(!this.multipleSelection.length){
                ElMessage({
                    type: 'error',
                    message: '没有选中！',
                })
            }
            this.multipleSelection.forEach(function (item){
                this.HandleExport(item.id)
            })
        },
        handleSelectionChange(val){
            this.multipleSelection = val.map(v => v.id)
        },

        HandleExport(id) {//等待处理
            request.get("records/"+id ,{
                responseType: 'blob',//设置返回类型为文件
            }).then((res)=>{
                const link=document.createElement('a');
                try {
                    let blob = new Blob([res.data],{type: 'text/plain'});//文件的格式为txt
                    let _fileName = res.headers['content-disposition'].split(';')[1].split('=')[1];//文件名，中文无法解析的时候会显示 _(下划线),生产环境获取不到
                    link.style.display='none';
                    // 兼容不同浏览器的URL对象
                    const url = window.URL || window.webkitURL || window.moxURL;
                    link.href=url.createObjectURL(blob);
                    link.setAttribute('download', _fileName.substring(_fileName.lastIndexOf('_')+1));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    url.revokeObjectURL(link.href);//销毁url对象
                }catch (e) {
                    console.log('下载的文件出错',e)
                }
            }).catch(()=>{
            })
        },
        handleCurrentChange(){
            this.load()
        },
    },
}
</script>
