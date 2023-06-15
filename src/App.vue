<template>
    <div>
        <router-view style="flex: 1" :key="$route.fullPath"/>
    </div>
</template>
<script>
export default {
    name: 'VueLayout',
    provide (){
        return {
            reload: this.reload
        }
    },
    data (){
        return {
            isRouterAlive: true
        }
    },
    methods: {

    }
}
</script>

