import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import Router from './router'
import 'element-plus/dist/index.css'
import Store from './store'

createApp(App).use(ElementPlus).use(Store).use(Router).mount('#app')
