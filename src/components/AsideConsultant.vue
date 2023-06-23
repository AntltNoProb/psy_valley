<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        style="width: 200px; min-height: calc(100vh - 90px)"
        :default-active="$route.path"
        router
        :default-openeds="openeds"
        class="el-menu-vertical-demo">
        <el-menu-item index="/home">
            <el-icon><icon-menu /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/working-schedule">
            <el-icon><icon-menu /></el-icon>
            <span>排班</span>
        </el-menu-item>
        <el-menu-item index="/consult-record">
            <el-icon><icon-menu /></el-icon>
            <span>咨询记录</span>
        </el-menu-item>
        <el-menu-item index="/userspace">
            <el-icon><setting /></el-icon>
            <template #title>账户设置</template>
        </el-menu-item>
        <el-sub-menu index="1">
            <template #title>
                <el-icon><IconMenu /></el-icon>
                <span>会话管理</span>
            </template>
            <el-dialog title="通知" v-model="dialogVisible">
                <el-text>有新的消息</el-text>
                <template #footer>
                      <span class="dialog-footer">
                          <el-button type="danger" size="default" @click="dialogVisible = false">取消</el-button>
                          <el-button type="primary" size="default" @click="this.$router.push({path:'chat',query:{'pno': vistorPno, 'name': vistorName}});dialogVisible = false">确定</el-button>
                      </span>
                </template>
            </el-dialog>
            <el-menu-item-group title="咨询">
                <el-menu-item v-for="(o, cnt) in currentVisitors" :key="o" @click="$router.push({path: 'chat', query:{'pno': visitorPnos[cnt], 'name': visitorNames[cnt]}})">
                    <span>{{visitorNames[cnt]}}</span>
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="求助">
                <el-menu-item  v-for="(o, inx) in currentSupervisor" :key="o" @click="$router.push({path: 'assist', query:{'username': supervisorUsername[inx], 'name': supervisorName[inx]}})">
                    <span >{{supervisorName[inx]}}</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
    </el-menu>
</template>
<script>

import {
    Menu as IconMenu,
    Setting,
    ArrowDown ,

} from '@element-plus/icons'
import {onBeforeUnmount, ref} from "vue";
import {globaltim} from "@/main";
import {genTestUserSig} from "@/IMdebug";
import TIM from "tim-js-sdk";
//eslint-disable-next-line no-unused-vars
import request from "@/utils/request";
//import router from "@/router";
// eslint-disable-next-line no-unused-vars
//import {ElMessage} from "element-plus";


export default {
    inject:['reload'],
    name:"AsideConsultant",
    setup(){
        let visitorNames=ref([]);
        let visitorPnos=ref([]);
        let supervisorName=ref([]);
        let supervisorUsername=ref([]);
        //eslint-disable-next-line no-unused-vars
        let conversationList = ref([]);
        let currentVisitors = ref(0);
        let currentSupervisor = ref(0);

        // TIM登录
        let userinfo = sessionStorage.getItem("user")
        let userID = JSON.parse(userinfo).username;
        console.log(userID);
        let userSig = genTestUserSig(userID).userSig; //签名信息

        let promise1 = globaltim.login({userID: userID, userSig: userSig});
        promise1.then(function(imResponse) {
          console.log(imResponse.data, "登录成功============="); // 登录成功
          if (imResponse.data.repeatLogin === true) {
            // 标识帐号已登录，本次登录操作为重复登录。v2.5.1 起支持
            console.log(imResponse.data.errorInfo);
          }
          // eslint-disable-next-line no-unused-vars
          let onSdkReady = function(event) {
            // 修改个人标配资料
            let promise2 = globaltim.updateMyProfile({
              nick: JSON.parse(sessionStorage.getItem("user")).name,
              // avatar: 'http(s)://url/to/image.jpg',
              // gender: TIM.TYPES.GENDER_MALE,
              // selfSignature: '我的个性签名',
              // allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY
            });
            promise2.then(function(imResponse) {
              console.log(imResponse.data); // 更新资料成功
              console.log(JSON.parse(sessionStorage.getItem("user")).name, 'updateProfile');
            }).catch(function(imError) {
              console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
            });
          };
          globaltim.on(TIM.EVENT.SDK_READY, onSdkReady);
        }).catch(function(imError) {
          console.warn('login error:', imError); // 登录失败的相关信息
        });

        let vistorPno = ref('');
        let vistorName = ref('');
        let dialogVisible = ref(false);

      let onMessageReceived1 = function(event) {
        // event.data - 存储 Message 对象的数组 - [Message]
          console.log(event.data[0],"pic");
        // 把发送来的消息更新到仓库
        if(event.data[0].from !== supervisorName.value[0]) {
          //globaltim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived1);

            if(sessionStorage.getItem(event.data[0].from) != null){
              let tmp = JSON.parse(sessionStorage.getItem(event.data[0].from))
              console.log(tmp, 'tmp');
              let message = [...tmp, event.data[0]];
              sessionStorage.setItem(event.data[0].from, JSON.stringify(message));
          }else {
              let message = [event.data[0]];
              sessionStorage.setItem(event.data[0].from, JSON.stringify(message));
          }

          if(JSON.parse(sessionStorage.getItem('user')).bind_username !== event.data[0].from ){
              vistorPno.value=event.data[0].from;
                vistorName.value=event.data[0].nick;
                dialogVisible.value=true;
          }
        }
      };

      //监听发送来的消息
      globaltim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived1);


        let intervalId = setInterval(function (){
            let promise = globaltim.getConversationList();
            promise.then(function(imResponse) {

                //获取绑定督导的username和name
                request.get("/counselors/boundSupervisor",{
                  params:{
                    username: userID
                  },
                }).then(res => {
                  let tmp;
                  supervisorName.value=[];
                  supervisorUsername.value=[];
                  currentSupervisor.value=res.data.total;
                  for (tmp of res.data.supervisors){
                    supervisorUsername.value=[...supervisorUsername.value, tmp.username];
                    supervisorName.value=[...supervisorName.value, tmp.name];
                  }
                  console.log(supervisorName,'supervisorName');
                  console.log(supervisorUsername,'supervisorPnos');
                    conversationList.value = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
                    // console.log(conversationList.value, 'conversation======');
                    let item;
                    visitorNames.value=[];
                    currentVisitors.value=conversationList.value.length;
                    visitorPnos.value=[];
                    for (item of conversationList.value){
                        console.log(item.userProfile.userID, 'item');
                        if(item.userProfile.userID !== supervisorUsername.value[0]){
                            visitorPnos.value=[...visitorPnos.value, item.userProfile.userID];
                            visitorNames.value=[...visitorNames.value, item.userProfile.nick];
                        }
                    }
                    currentVisitors.value=visitorNames.value.length;
                    console.log(visitorNames,'visitorNames');
                    console.log(visitorPnos, 'visitorPnos');
                })


            }).catch(function(imError) {
                console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
        }, 1000);

        onBeforeUnmount(() => {
          clearInterval(intervalId)
          intervalId = null;
          globaltim.off(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived1)
        })

        return{
            vistorPno,
            vistorName,
            visitorNames,
            visitorPnos,
            dialogVisible,
            supervisorName,
            supervisorUsername,
            currentVisitors,
            currentSupervisor
        }
    },
    data(){
        return{
            openeds: ['1'],
            uniqueOpened: false
        }
    },
    mounted() {
        document.title='心声谷'
    },
    components: {
        Setting,
        ArrowDown ,
        IconMenu,
    },
}
</script>