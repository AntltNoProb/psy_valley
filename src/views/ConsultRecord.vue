<template>
    <div style="padding: 10px">
        <el-dialog title="详情" v-model="dialogFormVisible">
            <div style="width:100%">
                <el-scrollbar>
                    <div v-for="(itemc,indexc) in messageList" :key="indexc">
                        <el-row gutter="10" v-if = "itemc.flow === 'in'" type="flex" justify="start">
                            <el-col span="4" >
                                <el-avatar shape="square" :size="50" src="itemc.headUrl"/>
                            </el-col>
                            <el-col span="8" >{{itemc.from}}</el-col>
                            <div class="tip-left">{{itemc}}</div>
                        </el-row>
                        <el-row gutter="10" v-else type="flex" justify="end">
                            <el-col span="12">
                                <div class="tip-right">{{itemc}}</div>
                            </el-col>
                            <el-col span="8">{{itemc.from}}</el-col>
                            <el-col span="4"><el-avatar shape="square" :size="50" src="itemc.headUrl" /></el-col>
                        </el-row>
                    </div>
                </el-scrollbar>
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
                    <el-button type="primary" @click="this.dialogFormVisible = true">查看详情</el-button>
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
export default {
    name: 'consult-record',
    components: {

    },
    data() {
        return {
            dialogFormVisible: false,
            param: {
                startTime: '',
                endTime: '',
                date: '',
            },
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
        consultDetails(){//查看详情

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
