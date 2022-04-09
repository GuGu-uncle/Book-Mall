<template>
	<view class="container" @click="a($event)">
		<view id="1">111</view>
		<view id="2">222</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods:{
			a(a){
				console.log(a)
				console.log(event)
			}
		}

	}
</script>

<style>

</style>
