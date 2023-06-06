<template>
    <div style="padding: 10px">
        <div style="margin: 10px 0">
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
            <el-table-column prop="id" label="督导"/>
            <el-table-column prop="ordername" label="咨询师" />
            <el-table-column prop="sendadd" label="咨询时长" />
            <el-table-column prop="status" label="咨询日期"  sortable/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="assistRecord">查看详情</el-button>
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
            param: {
                startTime: '',
                endTime: '',
                date: '',
            },
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

    },
    mounted(){
        document.title='查询记录'
    },
    methods :{

        dateFormat(picker) {
            this.params.startTime = picker[0].toString()
            this.params.endTime = picker[1].toString()
        },

        load(){
            request.get("/records/list",{
                params:{
                    pageNum: this.currentPage,
                    pageSize:10,
                    visitor: this.searchVisitor,
                    counselor: this.searchCounselor,
                    startDate: this.param.startTime,
                    endDate: this.param.endTime,
                },
            }).then(res => {
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
                return
            }
            // request.post("/records/exportAll", this.multipleSelection).then(res =>{
            //
            // })
        },
        handleSelectionChange(val){
            this.multipleSelection = val.map(v => v.id)
        },

        // HandleExport(id) {//等待处理
        //     request.post("/records/" + id).then(res => {
        //
        //     })
        // },

        handleCurrentChange(){
            this.load()
        },
    },
}
</script>
