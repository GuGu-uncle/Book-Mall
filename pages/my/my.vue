<template>
	<view>
		我的
	</view>
</template>

<script>
	import {Login} from '@/config/utils.js'//引入自定义工具
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			// 判断用户的token是否为空,为空则跳转至登录页面
			if(Login()) return 
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
