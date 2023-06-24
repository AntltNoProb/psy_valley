<template>
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
            <el-table-column prop="v_name" label="咨询者" />
            <el-table-column prop="duration" label="咨询时长" />
            <el-table-column prop="starttime" label="咨询日期" sortable />

            <el-table-column prop="level" label="咨询评级" sortable />
            <el-table-column prop="evaluate" label="咨询评价" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="this.dialogFormVisible = true" size="small">查看详情</el-button>
                    <el-popconfirm title="确认要导出吗?" @confirm="HandleExport(scope.row.id)">
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
        };
    },
    methods: {
        loadLatest() {
            const url = "/records/latestRecord/" + this.user.username;
            request.get(url).then(res => {
                if (res.code == '1') {
                    this.tableData = res.data.records;
                } else {
                    ElMessage({
                        type: 'error',
                        message: '最近咨询记录获取失败: ' + res.message,
                    });
                }
            }).catch(err => {
                ElMessage({
                    type: 'error',
                    message: '最近咨询记录获取错误: ' + err,
                });
            });
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
</style>
<style>
.sup-latest-table .el-card__header {
    padding: 9px 20px;
}
</style>