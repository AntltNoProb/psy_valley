<template>
    <el-col>
        <el-row :span="8" v-for="(o, index) in currentVisitors" :key="o" :offset="index > 0 ? 2 : 0">
            <!-- v-for中是确认有几个card，可以从data中获取-->
            <el-card>
                <div style="text-align:center">
                    <el-form-item label = "访客姓名:">
                        <el-text>{{ names[index] }}</el-text>
                    </el-form-item>
                    <div class="bottom">
                        <time class="time">{{ currentDate }}</time>
                        <el-button type="text" class="button" @click="$router.push('/Chat')">开始聊天</el-button>
                    </div>
                </div>
            </el-card>
        </el-row>
    </el-col>
</template>

<script>
export default {
    name: 'ConsultOnline',
    components: {
    },
    data() {
        return {
            currentVisitors: 3,
            name:"Wang Wenhai",
            names:["wang", "wen", "hai"], // 从im获取用户名列表
            currentDate: new Date(),
        }
    },
    mounted(){
        document.title='会话列表'
    },
    methods:{

    }
}
</script>
