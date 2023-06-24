<template>
    <el-card class="info-card" shadow="hover" :body-style="{ padding: '0px' }">
        <el-row class="info-box" v-if="detail">
            <el-col :span="6" class="info-avatar-box">
                <el-avatar class="info-avatar" fit="cover" shape="square" :size="150" :src="avatarUrl" @error="han">
                    {{ user.username }}
                </el-avatar>
            </el-col>
            <el-col :span="10" class="info-main-box">
                <div class="info-main">
                    <div class="info-main-header">
                        <div class="info-name">
                            <el-text class="name-text">{{ user.name }}</el-text><br />
                            <el-text type="info" tag="italic">{{ scheduleTypeLoc() }}</el-text>
                        </div>
                    </div>
                    <div class="avg-rate">
                        <el-text type="default">综合评分: </el-text>
                        <!-- <el-rate v-model="rate" 
                                disabled show-score text-color="#ff9900"
                                score-template="{value} 分" /> -->
                        <el-rate v-model="rate" class="rate-text" disabled />
                    </div>

                </div>
            </el-col>
            <el-col class="info-total-box" :span="8">
                <el-statistic :value="totalCount" :value-style="{ color: 'white', fontSize: '2.5rem' }">
                    <template #title>
                        <el-text style="color:white">
                            累计完成咨询
                        </el-text>
                    </template>
                </el-statistic>

            </el-col>
        </el-row>
        <el-row class="info-box" v-else :gutter="10">
            <el-col :span="14" class="info-avatar-box-small">
                <el-avatar class="info-avatar" fit="cover" shape="square" :size="100" :src="avatarUrl" @error="han">
                    {{ user.username }}
                </el-avatar>
            </el-col>
            <el-col :span="10" class="info-main-box">
                <div class="info-main-small">
                    <div class="info-main-header-small">
                        <div class="info-name-small">
                            <el-text class="name-text-small">{{ user.name }}</el-text><br />
                            <el-text type="info" tag="italic">{{ scheduleTypeLoc() }}</el-text>
                        </div>
                    </div>
                    

                </div>
            </el-col>
        </el-row>
    </el-card>
</template>
<script>
// import request from "../utils/request";
import { ElMessage } from "element-plus";
// import Head001 from "@/assets/head/head001.png"
import {globaltim} from "@/main";
import {ref} from "vue";
export default {
    setup(){
      console.log("进入这段=====");
      let avatarUrl = ref();
      function myAvatar(){
        let promise = globaltim.getMyProfile();
        promise.then(function(imResponse) {
          console.log(imResponse.data, 'avatar======='); // 个人资料 - Profile 实例
          avatarUrl.value = imResponse.data.avatar;
        }).catch(function(imError) {
          console.warn('getMyProfile error:', imError); // 获取个人资料失败的相关信息
        });
      }
      setTimeout(myAvatar, 800);
      return{
        avatarUrl
      }
    },
    props: {
        detail: {
            type: Boolean,
            default: false,
        },
        rateP: {
            type: Number,
            default: 0,
        },
        totalCount: {
            type: Number,
            default: 0,
        },
        // avatarUrl: {
        //     type: String,
        //     default: Head001,
        // }
    },
    data() {
        return {
            user: {},
            mmm: ElMessage,
            rate: this.rateP,
        };
    },
    created() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
    },
    methods: {
        han(e) {
            ElMessage(e);
        },
        scheduleTypeLoc() {
            return this.user.authority.toLowerCase() == 'counselor' ? '咨询师' : '督导';
        },
    },
    watch: {
        rateP(n) {
            this.rate = n;
        }
    }
}

</script>
<style scoped>
.info-card {
    align-items: center;
    text-align: center;
    justify-content: space-between;
}

.info-box {
    display: flex;
    align-items: stretch;
    text-align: center;
    justify-content: flex-start;
}

.info-avatar {
    background-color: #00000000;
    box-shadow: var(--el-box-shadow);
}

.info-main-box {
    padding: 20px 20px 20px 20px;
    box-shadow: 210px 10px 5px white;
}

.info-avatar-box {
    padding: 20px 10px 20px 20px;
}

.info-avatar-box-small {
    padding: 10px 10px 10px 0px;
}

.info-total-box {
    background-color: #545c64;
    color: #fff;
    padding: 20px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.info-main {
    display: block;
    height: 100%;
    padding: 10px;
}

.info-main-small {
    display: block;
    height: 100%;
    padding: 10px 10px 10px 0;
}

.info-main-header {
    display: flex;
    margin-bottom: 1em;
}

.info-main-header-small {
    display: flex;
    margin-bottom: 1em;
}

.name-text {
    color: black;
    font-weight: 1000;
    font-size: 1.6rem;
    padding: 0 10px;
}

.name-text-small {
    color: black;
    font-weight: 1000;
    font-size: 1.2rem;
    padding: 0 10px;
}

.avg-rate {
    padding-top: 20px;
    margin-bottom: 0;
}
</style>
<style>
.info-avatar img {
    width: 100%;

}

.info-total-title {
    color: white;
}
</style>
