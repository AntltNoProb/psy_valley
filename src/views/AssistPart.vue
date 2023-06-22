<template>
    <div style="padding: 10px" >
        <el-row type="flex" justify="center" :style="{backgroundColor: 'pink'}">
            <p>{{supervisorName}}</p>
        </el-row>
        <div style="width:100%" :style="{height: slbHeight}">
            <el-scrollbar ref="scrollbarRef">
                <div ref="innerRef">
                    <div v-for="(itemc,indexc) in messageList" :key="indexc">
                        <el-row gutter="10" v-if = "itemc.flow === 'in'" type="flex" justify="start">
                            <el-col span="4" >
                                <el-avatar shape="square" :size="50" :src="headTwoUrl"/>
                            </el-col>
                            <el-col span="8" >{{supervisorName}}</el-col>
                            <div class="tip-left">{{messageContent(itemc)}}</div>
                        </el-row>
                        <el-row gutter="10" v-else type="flex" justify="end">
                            <el-col span="12">
                                <div class="tip-right">{{messageContent(itemc)}}</div>
                            </el-col>
                            <el-col span="8">{{myname}}</el-col>
                            <el-col span="4"><el-avatar shape="square" :size="50" :src="headOneUrl" /></el-col>
                        </el-row>
                    </div>
                </div>
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
            <el-button type="danger" size="large" @click="endAssist">结束求助</el-button>
            <el-button type="success" size="large" @click="sendMsg">发送</el-button>
        </el-row>
    </div>
</template>

<script>

// 引入样式和quillEditor
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import HeadOne from "@/assets/head/head001.png";
import HeadTwo from "@/assets/head/head002.png";
// 注册 quillEditor
import TIM from "tim-js-sdk";
import {quillEditor} from "vue-quill-editor/src";
import {globaltim} from "@/main";
//import {genTestUserSig} from "@/IMdebug";
import {ref} from "vue";
import {useRoute} from "vue-router";

// import request from "@/utils/request";

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
    name:"assistPart",
    components: {
        quillEditor
    },
    setup(){
        const startTime = new Date();

        const route = useRoute();

        let supervisorName = ref(route.query.name);
        let supervisorUsername = ref(route.query.username);

        let imReady=ref(false);
        let messageList = ref([]);

        if(sessionStorage.getItem(supervisorUsername.value)!=null){
            let tmp = JSON.parse(sessionStorage.getItem(supervisorUsername.value));
            messageList.value = [...messageList.value, ...tmp];
        }
        let updateOtherSendToMeMsg=(payload)=>{
            if(payload.payload.text != null){
                messageList.value = [...messageList.value, payload];
                let messageListJson = JSON.stringify(this.messageList);
                sessionStorage.setItem(supervisorUsername.value, messageListJson);
            }
            console.log(messageList.value, 'message======================');
        }
        // TIM监听接收消息
        let onMessageReceived = function(event) {
            // event.data - 存储 Message 对象的数组 - [Message]
            console.log(event.data);
            // 把发送来的消息更新到仓库
            if(event.data[0]!=='') {
                updateOtherSendToMeMsg(event.data[0])
            }
        };

        //监听发送来的消息
        globaltim.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived);

        return{
            startTime,
            supervisorName,
            supervisorUsername,
            imReady,
            messageList,
            updateOtherSendToMeMsg
        }
    },

    data(){
        return {
            headOneUrl: HeadOne,
            headTwoUrl: HeadTwo,
            form:{
              s_username:'',
              c_username:'',
              duration:'',
              date:'',
            },
            slbHeight:'',
            clientHeight:'',
            endTime:'',
            timeDiff:'', // 时间差（格式：hh:mm:ss）
            content: '',//聊天的内容
            editorOption: {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow',
                placeholder: '请输入正文'
            },
            message:'',
            userId: '',
            indexc: 1,
            myname: JSON.parse(sessionStorage.getItem("user")).name
        }
    },

    watch:{
        clientHeight(){     //如果clientHeight 发生改变，这个函数就会运行
            this.changeFixed(this.clientHeight)
        },
    },
    computed:{
        TIM() {
            return TIM
        }
        // ...mapState(['imReady', 'messageList'])
    },
    mounted() {
        this.clientHeight = `${document.documentElement.clientHeight}`;//获取浏览器可视区域高度
        let that = this;
        window.onresize = function(){
            this.clientHeight =  `${document.documentElement.clientHeight}`;
            that.slbHeight = this.clientHeight - 375 + 'px';
        }
    },
    updated() {
        this.scrollToBottom();
    },
    methods :{
        calculateTimeDiff() {
            const diff = Math.abs(this.endDate - this.startDate) / 1000; // 获取时间差（单位：秒）
            const hours = Math.floor(diff / 3600);  // 计算小时数
            const minutes = Math.floor((diff % 3600) / 60); // 计算分钟数
            const seconds = Math.floor(diff % 60); // 计算秒数
            // 格式化时间差为 hh:mm:ss
            this.timeDiff = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`
            this.form.duration = this.timeDiff
            this.form.date = this.startTime
            this.form.c_username = JSON.parse(sessionStorage.getItem("user")).username
            this.form.s_username = this.supervisorUsername
        },
        padZero(num) {
            return String(num).padStart(2, '0'); // 补零，确保两位数格式
        },
        endAssist(){
            this.endTime = new Date();
            this.calculateTimeDiff();
            console.log(this.timeDiff);

            //request.post('assist/insert',this.form)

            let message = globaltim.createTextMessage({
                to: this.supervisorUsername,
                conversationType: TIM.TYPES.CONV_C2C,
                // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
                // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
                // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
                payload: {
                    text: 'TERMINATE'
                },
                // v2.20.0起支持C2C消息已读回执功能，如果您发消息需要已读回执，需购买旗舰版套餐，并且创建消息时将 needReadReceipt 设置为 true
                needReadReceipt: true
                // 消息自定义数据（云端保存，会发送到对端，程序卸载重装后还能拉取到，v2.10.2起支持）
                // cloudCustomData: 'your cloud custom data'
            });
            // 2. 发送消息
            let promise = globaltim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                console.log(imResponse, '结束求助发送成功');
                // 发送的消息更新代仓库，页面使用聊天记录自动更新
                //this.updateMySendMsg(message);
                // this.content = '';
                sessionStorage.removeItem(this.supervisorUsername)
                this.$router.push('home');
            }).catch(function(imError) {
                // 发送失败
                console.warn('sendMessage error:', imError);

            });

            // 清空聊天记录
        },
        scrollToBottom(){
            this.$refs.scrollbarRef.setScrollTop(this.$refs.innerRef.clientHeight);
        },
        changeFixed(clientHeight){
            this.slbHeight = clientHeight -375 + 'px';
        },
        onEditorBlur () {
            console.log('onEditorBlur: ', this.content)
        },
        // 获得焦点事件
        onEditorFocus () {
            console.log('onEditorFocus: ',this.content)
        },
        // 内容改变事件
        onEditorChange () {
            console.log('onEditorChange: ', this.content)
        },

        messageKind(payload){
            return payload.type
        },

        messageContent(payload){
            if(payload.type === TIM.TYPES.MSG_TEXT){
                return payload.payload.text
            }else if(payload.type === TIM.TYPES.MSG_IMAGE){
                console.log(payload.payload.imageInfoArray, 'picture===================');
                return payload.payload.imageInfoArray[2].url;
            }
        },

        updateMySendMsg(payload){
            this.messageList = [...this.messageList, payload];
            let messageListJson = JSON.stringify(this.messageList);
            sessionStorage.setItem(this.supervisorUsername, messageListJson);
            console.log(sessionStorage.getItem(this.supervisorUsername), 'sessionStorage=================');
        },

        sendMsg(){
            this.content = this.$refs.myLQuillEditor.quill.getText();
            console.log(this.content);
            console.log(globaltim, 'globaltim===================');
            console.log(this.imReady);
            if(this.content.trim() === ''){
                alert('请输入聊天信息');
                return
            }
            //发送消息
            console.log(this.supervisorName,'sendToName===============');
            let message = globaltim.createTextMessage({
                to: this.supervisorUsername,
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
            let promise = globaltim.sendMessage(message);
            promise.then((imResponse) => {
                // 发送成功
                console.log(imResponse, '发送成功');
                // 发送的消息更新代仓库，页面使用聊天记录自动更新
                this.updateMySendMsg(message);
                // this.content = '';
                this.$nextTick(()=>{
                    this.scrollToBottom();
                });
                this.$refs.myLQuillEditor.quill.setText('')
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
