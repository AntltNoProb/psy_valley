<template>
    <div style="padding: 10px">
        <!--    功能区域-->
        <div style="margin: 10px 0">
            <el-text type="primary">hello!</el-text>
        </div>

    </div>
</template>

<script>


// import request from "../utils/request";
// import {ElMessage} from "element-plus";

export default {
    name: 'VueHome',
    components: {

    },
    // data() {
    //     const validconf = (rule, value, callback) => {
    //         if (value !== this.form.password) {
    //             callback(new Error("密码不同！"))
    //         } else {
    //             callback()
    //         }
    //     }
    //     const validnum = (rule, value, callback) => {
    //         if(String(value).length !== 11) {
    //             callback(new Error("手机号要求11位"))
    //         } else {
    //             callback()
    //         }
    //     }
    //     return {
    //         form:{},
    //         dialogTableVisible:false,
    //         held : 0 ,
    //         dialogVisible:false,
    //         search: '',
    //         currentPage: 1 ,
    //         total: 10 ,
    //         tableData: [],
    //         gridData:[],
    //         rules: {
    //             username: [
    //                 {
    //                     required: true,
    //                     message: '请输入用户名',
    //                     trigger: 'blur',
    //                 },
    //             ],
    //             phonenum:[
    //                 {
    //                     required: true,
    //                     message: '请输入手机号',
    //                     trigger: 'blur',
    //                 },
    //                 {
    //                     validator: validnum,
    //                     trigger: 'blur',
    //                 }
    //             ],
    //             password: [
    //                 {
    //                     required: true,
    //                     message: '请输入密码',
    //                     trigger: 'blur',
    //                 },
    //                 {
    //                     min:5,
    //                     message: '密码不得少于5个字符',
    //                     trigger: 'blur',
    //                 },
    //             ],
    //             confirm: [
    //                 {
    //                     required: true,
    //                     message: '请确认密码',
    //                     trigger: 'blur',
    //                 },
    //                 {
    //                     validator: validconf,
    //                     trigger: 'blur',
    //                 },
    //             ],
    //         }
    //     }
    // },
    // created(){
    //     this.load()
    // },
    // mounted() {
    //     document.title='物流管理中心'
    // },
    // methods :{
    //     add(){
    //         this.dialogVisible = true
    //         this.held = 1
    //         this.form={}
    //         this.$refs['ruleForm'].resetFields()
    //     },
    //     findHisOrder(id){
    //         request.get("/api/order",{
    //             params:{
    //                 pageNum: 1,
    //                 pageSize:10,
    //                 search : "",
    //                 Flag: 'userx',
    //                 userID: id,
    //             },
    //         }).then(res=>{
    //             if(res.code === '0'){
    //                 this.dialogTableVisible=true
    //                 this.gridData = res.data.records
    //             }
    //         })
    //     },
    //     findEmployeeOrder(id){
    //         request.get("/api/order",{
    //             params:{
    //                 pageNum: 1,
    //                 pageSize:10,
    //                 search : "",
    //                 Flag: 'driver',
    //                 userID: id,
    //             },
    //         }).then(res=>{
    //             if(res.code === '0'){
    //                 this.dialogTableVisible=true
    //                 this.gridData = res.data.records
    //             }
    //         })
    //     },
    //     load(){
    //         request.get("/api/user",{
    //             params:{
    //                 pageNum: this.currentPage,
    //                 pageSize:10,
    //                 search : this.search,
    //             },
    //         }).then(res => {
    //             console.log(res)
    //             this.tableData=res.data.records
    //             this.total = res.data.total
    //         })
    //     },
    //     save(){
    //         this.$refs['ruleForm'].validate((valid) =>{
    //             if(valid){
    //                 if(this.form.id){
    //                     request.put("/api/user",this.form).then(res => {
    //                         console.log(res)
    //                         if(res.code == "0"){
    //                             ElMessage({
    //                                 type: 'success',
    //                                 message: '修改成功',
    //                             })
    //                         }else{
    //                             ElMessage({
    //                                 type: 'error',
    //                                 message: res.msg,
    //                             })
    //                         }
    //                         this.load()
    //                     })
    //                 }
    //                 else{
    //                     request.post("/api/user",this.form).then(res => {
    //                         console.log(res)
    //                         if(res.code == "0"){
    //                             ElMessage({
    //                                 type: 'success',
    //                                 message: '添加成功',
    //                             })
    //                         }else{
    //                             ElMessage({
    //                                 type: 'error',
    //                                 message: res.msg,
    //                             })
    //                         }
    //                         this.load()
    //                     })
    //                 }
    //                 this.dialogVisible = false
    //             }
    //         })
    //     },
    //     handleEdit(row) {
    //         this.form = JSON.parse(JSON.stringify(row))
    //         this.held = 2
    //         this.dialogVisible = true
    //         this.$refs['ruleForm'].resetFields()
    //     },
    //     HandleDelete(id) {
    //         console.log(id)
    //         request.delete("/api/user/" + id).then(res => {
    //             console.log(res)
    //             if(res.code == "0"){
    //                 ElMessage({
    //                     type: 'success',
    //                     message: '删除成功',
    //                 })
    //             }else{
    //                 ElMessage({
    //                     type: 'error',
    //                     message: res.msg,
    //                 })
    //             }
    //             this.load()
    //         })
    //     },
    //     handleCurrentChange(){
    //         this.load()
    //     },
    // },

}
</script>
