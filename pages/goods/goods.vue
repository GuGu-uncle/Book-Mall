<template>
	<view>
		商品
		<u-tabs :list="list1" :scrollable='false'></u-tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list1:[
					{name:'默认'},
					{name:'销量'},
					{name:'推荐'},
					{name:'最新'}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
