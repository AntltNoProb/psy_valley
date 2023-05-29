import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'VueLayout',
        component: ()=>import('@/layout/VueLayout.vue'),
        redirect:"/home",
        children:[
             {path: 'home',
                 name: 'home',
                 component: () => import('@/views/Home.vue'),
             },

             {path: 'consult-record',
                name: 'consult-record',
                component: ()=>import('@/views/ConsultRecord.vue'),
                meta: {
                    //         roles: ['admin']
                },
            },
            /*
             {path: 'userspace',
                 name: 'userspace',
                 component: () => import('@/views/UserSpace.vue'),
                 meta: {
                    // roles: ['admin', 'user','employee']
                 },
             },


             {path: 'working-schedule',
                 name: 'working-schedule',
                 component: () => import('@/views/WorkingSchedule.vue'),
                 meta: {
             //        roles: ['admin']
                 },
             },

             {path: 'counselor-management',
                 name: 'counselor-management',
                 component: ()=>import('@/views/CounselorManagement.vue'),
                 meta: {
            //         roles: ['admin']
                 },
             },
             {path: 'visitor-management',
                 name: 'visitor-management',
                 component: ()=>import('@/views/VisitorManagement.vue'),
                 meta: {
            //         roles: ['employee']
                 },
             },
             {path: 'supervisor-management',
                 name: 'supervisor-management',
                 component: ()=>import('@/views/SupervisorManagement.vue'),
                 meta: {
            //         roles: ['user']
                 },
             },*/
        ]
    },
    {path: '/login', name: 'login', component: ()=>import('@/views/Login.vue')}
]

const router = createRouter({

    history: createWebHistory(),
    routes
})

// router.beforeEach((to, from, next) => {
//     // if (to.path === '/login' || to.path === '/register' || to.path === '/404' ) {
//     //     next();
//     // } else {
//     //     let token = localStorage.getItem('Authorization');
//     //     if (token === 'null' || token === '') {
//     //         next('/login');
//     //     } else {
//     //         let user = sessionStorage.getItem('user')
//     //         if(!user){
//     //             next('/login')
//     //         }
//     //         let role = JSON.parse(user).authority
//     //         if(to.meta.roles.includes(role)){
//     //             next()	//放行
//     //         }else{
//     //             next('/404')	//跳到404页面
//     //         }
//     //     }
//     // }
//     next('/login')
// });
export default router
