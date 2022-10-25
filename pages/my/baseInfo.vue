<template>
	<!-- 修改用户名 -->
	<view class="container">
		<u--form
				labelPosition="left"
				:model="model1"
				:rules="rules"
				ref="form1"
				:errorType="errorType"
				labelWidth="80"
				:labelStyle="{fontSize:'34rpx'}"
		>
			<u-form-item
				required
				label="姓名"
				prop="userInfo.name"
				borderBottom
				ref="item1"
			>
				<u--input
						v-model="model1.userInfo.name"
						border="none"
						fontSize="34"
				></u--input>
			</u-form-item>
			<u-button type="primary" @click="submit" :customStyle="{marginTop:'20rpx',fontSize:'36rpx'}">提交</u-button>
		</u--form>
	</view>
</template>

<script>
	import {apiUpdateUserInfo} from '@/config/api.js'
	import {toBack,updateUser} from '@/config/utils.js'
	export default {
		data() {
			return {
				model1: {
					userInfo: {
						name: 'uView UI'
					},
				},
				errorType: 'message',
				rules: {
					'userInfo.name': {
						type: 'string',
						required: true,
						message: '请填写姓名',
						trigger: ['blur']
					}
				},
			}
		},
		onLoad() {
			// 获取用户名
			this.model1.userInfo.name = uni.getStorageSync('user').name
		},
		methods: {
			// 校验
			submit() {
				this.$refs.form1.validate().then(async (res) => {
					uni.$u.toast('修改成功')
					await apiUpdateUserInfo({name:this.model1.userInfo.name})//更新用户名
					//更新用户信息
					await updateUser()
					//返回跳转前的页面
					setTimeout(() => {
						uni.switchTab({
							url:'/pages/my/my'
						})
					},1)
				}).catch(errors => {
					console.log(errors)
					uni.$u.toast('校验失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding:0 40rpx;
		margin:20rpx auto;
	}
</style>
