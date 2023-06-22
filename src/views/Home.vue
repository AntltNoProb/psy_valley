<template>
    <HomeCounselor v-if="authority == 'Counselor'" />
    <HomeSupervisor v-else-if="authority == 'Supervisor'" />
    <HomeAdmin v-else-if="authority == 'SystemManager'" />
    <el-main v-else class="main-default-placeholder">
        <div>
            权限获取错误! 请检查网络或刷新网页
        </div>
    </el-main>
</template>
<script>
import { ElMessage } from 'element-plus';
import HomeAdmin from './HomeAdmin.vue';
import HomeCounselor from './HomeCounselor.vue';
import HomeSupervisor from './HomeSupervisor.vue';
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'home',
    data() {
        return {
            authority: '',
        }
    },
    components: {
        HomeAdmin,
        HomeCounselor,
        HomeSupervisor,
    },
    methods: {
        loadAuthority() {
            let user = sessionStorage.getItem('user');
            if (!user) {
                ElMessage({
                    type: 'error',
                    message: '权限获取错误! 请检查网络或刷新网页',
                });
                return;
            }
            this.authority = JSON.parse(user).authority;
        },
    },
    mounted() {
        this.loadAuthority();
    },
}
</script>
<style>

</style>