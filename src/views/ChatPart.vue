<template>
    <div style="padding: 10px">
        <el-row type="flex" justify="center" :style="{backgroundColor: 'pink'}">
            <p>{{sendToName}}</p>
        </el-row>
        <div style="width:100%" :style="{height: slbHeight}">
            <el-scrollbar>
                <div v-for="(itemc,indexc) in messageList" :key="indexc">
                    <el-row gutter="10" v-if = "itemc.flow === 'in'" type="flex" justify="end">
                        <el-col span="12">
                            <div class="tip-right">{{itemc.payload.text}}</div>
                        </el-col>
                        <el-col span="8">{{itemc.from}}</el-col>
                        <el-col span="4"><el-avatar shape="square" :size="50" src="itemc.headUrl" /></el-col>
                    </el-row>
                    <el-row gutter="10" v-else type="flex" justify="start">
                        <el-col span="4" ><el-avatar shape="square" :size="50" src="itemc.headUrl"/></el-col>
                        <el-col span="8" >{{itemc.from}}</el-col>
                        <div class="tip-left">{{itemc.payload.text}}</div>
                    </el-row>
                </div>
<!--              <div v-for="(itemc,indexc) in recordContent" :key="indexc">-->
<!--                <el-row gutter="10" v-if = "itemc.mineMsg" type="flex" justify="end">-->
<!--                  <el-col span="12">-->
<!--                    <div class="tip-right">{{itemc.contactText}}</div>-->
<!--                  </el-col>-->
<!--                  <el-col span="8">{{itemc.nickName}}</el-col>-->
<!--                  <el-col span="4"><el-avatar shape="square" :size="50" src="itemc.headUrl" /></el-col>-->
<!--                </el-row>-->
<!--                <el-row gutter="10" v-else type="flex" justify="start">-->
<!--                  <el-col span="4" ><el-avatar shape="square" :size="50" src="itemc.headUrl"/></el-col>-->
<!--                  <el-col span="8" >{{itemc.nickName}}</el-col>-->
<!--                  <div class="tip-left">{{itemc.contactText}}</div>-->
<!--                </el-row>-->
<!--              </div>-->
            </el-scrollbar>
        </div>
        <div>
            <div class="local-quill-editor">
                <quill-editor
                        ref="myLQuillEditor"
                        v-model="content"
                        :options="editorOption"
                        class="editor"
                        @blur="onEditorBlur"
                        @focus="onEditorFocus"
                        @change="onEditorChange">
                        >
                </quill-editor>
            </div>
        </div>
        <el-row type="flex" justify="end">
            <el-button type="success" size="large" @click="sendMsg">发送</el-button>
        </el-row>
    </div>
</template>

<script>
// import {genTestUserSig} from '@/IMdebug/GenerateTestUserSig'
import {mapActions, mapMutations, mapState} from "vuex";
import {IM_APP_ID} from "@/IMconfig/im";
// 引入样式和quillEditor
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


// 注册 quillEditor


import TIM from "tim-js-sdk";
import {quillEditor} from "vue-quill-editor/src";
import store from "@/store";
// import {useRoute} from "vue-router";

const toolbarOptions = [
    // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
    ['bold', 'italic', 'underline', 'strike'],
    // 引用  代码块-----['blockquote', 'code-block']
    ['blockquote', 'code-block'],
    // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
    [{ header: 1 }, { header: 2 }],
    // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
    [{ list: 'ordered' }, { list: 'bullet' }],
    // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
    [{ script: 'sub' }, { script: 'super' }],
    // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
    [{ indent: '-1' }, { indent: '+1' }],
    // 文本方向-----[{'direction': 'rtl'}]
    [{ direction: 'rtl' }],
    // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
    [{ size: ['small', false, 'large', 'huge'] }],
    // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
    [{ color: [] }, { background: [] }],
    // 字体种类-----[{ font: [] }]
    [{ font: [] }],
    // 对齐方式-----[{ align: [] }]
    [{ align: [] }],
    // 清除文本格式-----['clean']
    ['clean'],
    // 链接、图片、视频-----['link', 'image', 'video']
    ['image', 'video']
]

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name:"chatPart",
    components: {
        quillEditor
    },

    data(){
      return {
            slbHeight:'',
            clientHeight:'',
            content: '123',//聊天的内容asdasd
            editorOption: {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow',
                placeholder: '请输入正文'
                // Some Quill optiosn...
            },

            sendToName: history.state.name ,
            message:'',
            userId: '',
            indexc: 1
            // recordContent:[
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': true,
            //         'headUrl':"head001.png",
            //         'nickName': "Tom",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': true,
            //         'headUrl': "head001.png",
            //         'nickName': "Tom",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': true,
            //         'headUrl': "head001.png",
            //         'nickName': "Tom",
            //         'contactText':"xiatounan",
            //     },
            //     {
            //         'mineMsg': false,
            //         'headUrl': "head002.png",
            //         'nickName': "jack",
            //         'contactText':"xiatounan",
            //     },
            // ],
        }
    },

    watch:{
        clientHeight(){     //如果clientHeight 发生改变，这个函数就会运行
            this.changeFixed(this.clientHeight)
        },
        imReady(value){
            if(value){
                this.getMessageList({userId:name});
                console.log(this.getMessageList({userId: name}));
            }
        }
    },
    computed:{
        ...mapState(['imReady', 'messageList'])
    },
    mounted() {
        this.clientHeight = `${document.documentElement.clientHeight}`;//获取浏览器可视区域高度
        let that = this;
        window.onresize = function(){
            this.clientHeight =  `${document.documentElement.clientHeight}`;
            that.slbHeight = this.clientHeight - 375 + 'px';
        }
    },
    methods :{
        changeFixed(clientHeight){
            this.slbHeight = clientHeight -375 + 'px';
        },
        onEditorBlur (e) {
            console.log('onEditorBlur: ', e)
        },
        // 获得焦点事件
        onEditorFocus (e) {
            console.log('onEditorFocus: ', e)
        },
        // 内容改变事件
        onEditorChange (e) {
            console.log('onEditorChange: ', e)
        },

        ...mapActions(['getMessageList']),
        ...mapMutations(['updateMySendMsg', 'updateIMStatus']),
        // async loginHandler(){
        //     console.log(this.userId);
        //     let userID = this.userId;
        //     let userSig = genTestUserSig(userID).userSig; //签名信息
        //     console.log(userSig, 'userSig==============================');
        //     try {
        //         let options = {
        //             SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
        //         };
        //         let tim = TIM.create(options);
        //         console.log(tim);
        //         let response = await tim.login({userID: userID, userSig: userSig});
        //         console.log(response, '登录后的信息===================================');
        //     } catch (e){
        //         console.log(e, '登录错误');
        //     }
        // },
        sendMsg(){
            console.log(this.content, 'content=======================');
            let options = {
                SDKAppID: IM_APP_ID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
            };
            let tim = TIM.create(options);
            // console.log(messageList, 'MessageList================');
            console.log('onSdkReady im ======================');
            store.commit('updateIMStatus', true);

            if(!this.imReady){
                alert('IM系统还未准备好');
                return
            }
            if(this.content.trim() === ''){
                alert('请输入聊天信息');
                return
            }
            //发送消息
          console.log(this.sendToName,'sendToName===============');
          let message = tim.createTextMessage({
                to: this.sendToName,
                conversationType: TIM.TYPES.CONV_C2C,
                // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
                // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
                // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
                payload: {
                    text: this.content
                },
                // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
                needReadReceipt: true
                // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
                // cloudCustomData: 'your cloud custom data'
            });
// 2. 发送消息
            let promise = tim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                console.log(imResponse, '发送成功');
                // 发送的消息更新代仓库，页面使用聊天记录自动更新
                this.updateMySendMsg(message);
                this.content = '';
            }).catch(function(imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);
            });
        }
    }
}
</script>
<style scoped lang="scss">
.editor {
    height: 200px;
}
</style>
<style>
    body {
        margin: 0;
        padding: 0;
    }
    /*左三角*/
    .tip-left {
        margin: 20px;
        padding: 5px;
        width: 300px;
        height: 60px;
        border: 2px solid #f99;
        position: relative;
        background-color: #FFF;
        /*设置圆角*/
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
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
        width: 300px;
        height: 60px;
        border: 2px solid #0ff;
        position: relative;
        background-color: #FFF;
        /*设置圆角*/
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
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
