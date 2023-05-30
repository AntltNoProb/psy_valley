<template>
    <div style="padding: 10px">

        <!--    搜索区域-->
        <div style="margin: 10px 0">
            <el-input v-model="search" placeholder="请输入访客姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询访客姓名</el-button>

            <el-input v-model="search"  placeholder="请输入咨询师姓名"  style="width: 20%" clearable />
            <el-button type="primary" style="margin-left: 7px" @click="load">查询咨询师姓名</el-button>

            <el-config-provider :locale="locale" >
                <el-date-picker
                    style="margin-left: 7px"
                    v-model="params.date"
                    type="daterange"
                    placeholder="选择日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                />
            </el-config-provider>

            <el-popconfirm title="确认要全部导出吗?" @confirm="deleteAll">
                <template #reference>
                    <el-button type="danger" style="float:right">全部导出咨询记录</el-button>
                </template>
            </el-popconfirm>
        </div>

        <el-table :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="咨询师"/>
            <el-table-column prop="ordername" label="访客" />
            <el-table-column prop="sendadd" label="咨询时长" />
            <el-table-column prop="receadd" label="咨询评价" sortable/>
            <el-table-column prop="status" label="咨询日期"  sortable/>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="add">查看详情</el-button>
                    <el-popconfirm title="确认要导出吗?" @confirm="HandleDelete(scope.row.id)">
                        <template #reference>
                            <el-button size="mini">导出</el-button>
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


//import request from "../utils/request";
//import {ElMessage} from "element-plus";

export default {
    name: 'consult-record',
    components: {

    },
    data() {
        return {
            params: {
                startTime: '',
                endTime: '',
                date: ''
            },
            form:{},
            dialogVisible:false,
            dialogForCar:false,
            dialogForDriver:false,
            search: '',
            currentPage: 1 ,
            total: 10 ,
            tableData: [],
            cntDriver: 10,
            DriverTableData:[],
            cntCar: 10,
            CarTableData:[],
            Flag: 'admin',
            user:{},
            multipleSelection:[],
            isEdit:false,
            Svalue:false,
        }
    },
    created(){
        // let userStr = sessionStorage.getItem("user")
        // if(userStr){
        //     this.user = JSON.parse(userStr)
        // }else{
        //     this.user = "无该用户"
        // }
        // this.load()
    },
    mounted(){
        document.title='查询记录'
    },
    methods :{
        // add(){
        //     this.dialogVisible = true
        //     this.isEdit =false
        //     this.form={}
        // },
        // findSenderId( name ){
        //     request.post("/api/user/nametoid",name).then(res=>{
        //         if (res.code === "0") {
        //             this.form.senderid = res.data.id
        //             this.form.senderphone = res.data.phonenum
        //             ElMessage({
        //                 type: 'success',
        //                 message: '选择成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //     })
        // },
        // findReceiverId(name){
        //     request.post("/api/user/nametoid",name).then(res=>{
        //         if (res.code === "0") {
        //             this.form.receiverid = res.data.id
        //             this.form.receiverphone = res.data.phonenum
        //             ElMessage({
        //                 type: 'success',
        //                 message: '选择成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //     })
        // },
        // load(){
        //     request.get("/api/order",{
        //         params:{
        //             pageNum: this.currentPage,
        //             pageSize:10,
        //             search: this.search,
        //             Flag: this.Flag,
        //             userID: this.user.id,
        //         },
        //     }).then(res => {
        //         res.data.records.forEach(function (item){
        //             request.post("/api/user/who", item.employeeid).then(res => {
        //                 if (res.code === "0") {
        //                     item.employeename = res.data.username
        //                 }
        //             })
        //             request.post("/api/user/who", item.senderid).then(res => {
        //                 if (res.code === "0") {
        //                     item.sendername = res.data.username
        //                 }
        //             })
        //             request.post("/api/user/who", item.receiverid).then(res => {
        //                 if (res.code === "0") {
        //                     item.receivername = res.data.username
        //                 }
        //             })
        //             request.post("/api/user/who", item.employeeid).then(res => {
        //                 if (res.code === "0") {
        //                     item.employeephone = res.data.phonenum
        //                 }
        //             })
        //             request.post("/api/user/who", item.senderid).then(res => {
        //                 if (res.code === "0") {
        //                     item.senderphone = res.data.phonenum
        //                 }
        //             })
        //             request.post("/api/user/who", item.receiverid).then(res => {
        //                 if (res.code === "0") {
        //                     item.receiverphone = res.data.phonenum
        //                 }
        //             })
        //         })
        //         this.tableData=res.data.records
        //         this.total = res.data.total
        //         this.Flag = "admin"
        //     })
        // },
        // handle(){
        //     if(!this.Svalue){
        //         this.load()
        //         return
        //     }
        //     this.Flag = "empty"
        //     this.load()
        // },
        // deleteAll(){
        //     if(!this.multipleSelection.length){
        //         ElMessage({
        //             type: 'error',
        //             message: '没有选中！',
        //         })
        //         return
        //     }
        //     request.post("/api/order/deleteAll", this.multipleSelection).then(res =>{
        //         if(res.code === '0'){
        //             ElMessage({
        //                 type: 'success',
        //                 message: '成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //         this.load()
        //     })
        // },
        // handleSelectionChange(val){
        //     this.multipleSelection = val.map(v => v.id)
        // },
        // save(){
        //     console.log(this.form)
        //     if(this.form.id){
        //         request.put("/api/order",this.form).then(res => {
        //             if(res.code == "0"){
        //                 ElMessage({
        //                     type: 'success',
        //                     message: '修改成功',
        //                 })
        //             }else{
        //                 ElMessage({
        //                     type: 'error',
        //                     message: res.msg,
        //                 })
        //             }
        //             this.load()
        //         })
        //     }
        //     else{
        //         request.post("/api/order",this.form).then(res => {
        //             console.log(res)
        //             if(res.code == "0"){
        //                 ElMessage({
        //                     type: 'success',
        //                     message: '添加成功',
        //                 })
        //             }else{
        //                 ElMessage({
        //                     type: 'error',
        //                     message: res.msg,
        //                 })
        //             }
        //             this.load()
        //         })
        //     }
        //     this.dialogVisible = false
        // },
        // handleEdit(row) {
        //     this.form = JSON.parse(JSON.stringify(row))
        //     this.dialogVisible = true
        //     this.isEdit =true;
        // },
        // getFreeCar(row) {
        //     request.get("/api/car",{
        //         params:{
        //             pageNum: 1,
        //             pageSize:10,
        //             search : "找车",
        //         },
        //     }).then(res => {
        //         this.CarTableData=res.data.records
        //         this.cntCar = res.data.total
        //         console.log(res)
        //     })
        //     this.dialogForCar = true
        // },
        // selectCar(row) {
        //     this.$refs.carTable.setCurrentRow(row)
        //     this.form.carid = JSON.parse(JSON.stringify(row.id))
        //
        // },
        // getFreeDriver(row) {
        //     request.get("/api/driver",{
        //         params:{
        //             pageNum: 1,
        //             pageSize:10,
        //             search : "找司机",
        //         },
        //     }).then(res => {
        //         this.DriverTableData=res.data.records
        //         this.cntDriver = res.data.total
        //         console.log(res)
        //     })
        //     this.dialogForDriver = true
        // },
        // selectDriver(row) {
        //     this.$refs.driverTable.setCurrentRow(row)
        //     this.form.employeeid = JSON.parse(JSON.stringify(row.driverid))
        // },
        // HandleDelete(id) {
        //     console.log(id)
        //     request.delete("/api/order/" + id).then(res => {
        //         if(res.code == "0"){
        //             ElMessage({
        //                 type: 'success',
        //                 message: '删除成功',
        //             })
        //         }else{
        //             ElMessage({
        //                 type: 'error',
        //                 message: res.msg,
        //             })
        //         }
        //         this.load()
        //     })
        // },
        // handleCurrentChange(){
        //     this.load()
        // },
    },
}
</script>
