<template>
	<!-- 修改或添加地址 -->
	<view class="container">
		<u--form 
			labelPosition="left" 
			:model="form" 
			:rules="rules" 
			errorType="message"
			ref="form" 
			labelAlign="right" 
			labelWidth="180" 
			:labelStyle="{marginRight:'30rpx',fontSize:'34rpx'}"
		>
			<!-- 姓名 -->
			<u-form-item label="姓名" borderBottom ref="item1" prop="name">
				<u--input v-model="form.name" border="none" fontSize="34rpx" placeholder="请输入姓名"></u--input>
			</u-form-item>
			<!-- 电话 -->
			<u-form-item label="电话" borderBottom prop="phone">
				<u--input v-model="form.phone" border="none" fontSize="34rpx" placeholder="请输入电话号码"></u--input>
			</u-form-item>
			<!-- 城市 -->
			<u-form-item label="城市" borderBottom prop="city">
				<view class="selectCity" @click="show = true">
					<view
						class="city"
					>{{form.province?form.province+form.city+form.county:"请选择城市"}}</view>
					<u-icon name="arrow-right" color="#2979ff" size="28"></u-icon>
				</view>
			</u-form-item>
			<!-- 详细住址 -->
			<u-form-item label="详细住址" borderBottom prop="address">
				<u--input v-model="form.address"  fontSize="34rpx" border="none" placeholder="请输入详细地址"></u--input>
			</u-form-item>
			<!-- 是否默认 -->
			<u-form-item label="是否默认" borderBottom>
				<u-switch v-model="isDefault" @change="change" size="40"></u-switch>
			</u-form-item>
		</u--form>
		<!-- 城市选择器 -->
		<u-picker 
			:show="show" 
			:columns="columns" 
			@change="changeCity" 
			@confirm="confirm" 
			@cancel="cancel" keyName="label"
		></u-picker>
		<!-- 修改或者添加地址 -->
		<button  @click="submit">{{addressId?"修改地址":"添加地址"}}</button>
		<!-- 删除地址 -->
		<button v-if="addressId" @click="deleteAddress">删除地址</button>
	</view>
</template>

<script>
	import provinces from "@/utils/province.js"
	import city from "@/utils/city.js"
	import areas from "@/utils/area.js"
	import { apiAddAddress, apiUpdateAddress, apiDeleteAddress } from '@/config/api.js'
	export default {
		data() {
			return {
				form: {
					name:'', //用户姓名
					phone:'', //用户手机号
					province:'', //省份
					city:'', //城市
					county:'', //县区
					address:'', //用户详细地址
				},
				// 开关
				isDefault: false,
				// 显示城市选择器
				show:false,
				// 城市选择器数据
				columns:[provinces,city[0],areas[0][0]],
				// 是否默认
				value:false,
				rules: {
					name: [{ required: true, message: '请填写姓名', trigger: ['blur','change'] },],
					phone: [
						{ required: true, message: '请填写手机号', trigger: ['blur','change'] },
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['blur','change'],
						}
					],
					city: [{ required: true, message: '请选择城市', trigger: ['blur','change'] },],
					address: [{ required: true, message: '请填写详细地址', trigger: ['blur','change'] },],
				},
				// 要修改的地址的id
				addressId:'',
				
			};
		},
		onLoad(options){
			// 判断地址列表页有没有地址信息传过来，有则修改地址，没有则添加地址
			if(options.addressInfo){
				// 获取要修改的地址的信息
				this.form = JSON.parse(options.addressInfo)
				// 获取要修改的地址的id
				this.addressId = this.form.id
				this.isDefault = this.form.is_default == 1 ? true : false
				delete this.form.id
			}
		},
		methods: {
			// 选择的城市发生变化时
			changeCity(value){
				let index = value.indexs
				this.columns = [provinces,city[index[0]],areas[index[0]][index[1]]]
			},
			// 城市选择器点击确定
			confirm(value){
				this.form.province = value.value[0].label //省份
				this.form.city = value.value[1].label //城市
				this.form.county = value.value[2].label //县区
				this.show = false
			},
			// 城市选择器点击取消
			cancel(){
				this.show = false
			},
			// 修改默认
			change(e){
				if(e){
					this.form.is_default = 1 //是否默认
				}else{
					delete this.form.is_default
				}
			},
			// 提交表单
			submit(){
				this.$refs.form.validate().then(async res => {
					if(!this.addressId){
						// 添加地址成功
						await apiAddAddress(this.form)
						uni.$u.toast('添加成功')
						// 跳到地址页
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}else{
						// 修改地址成功
						await apiUpdateAddress(this.addressId,this.form)
						uni.$u.toast('修改成功')
						// 返回到地址页
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}
				}).catch(errors => {
					uni.$u.toast('校验失败')
				})
			},
			// 删除地址
			async deleteAddress(){
				try{
					await apiDeleteAddress(this.addressId)
					uni.$u.toast('删除成功')
					// 返回到地址页
					setTimeout(()=>{
						uni.navigateBack()
					},1000)
				}catch(e){
					uni.$u.toast('删除失败')
				}
				
			}
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		margin: 20rpx 40rpx;
		
		.selectCity {
			display: flex;
			justify-content: space-between;
			width: 100%;
			.city {
				width: 460rpx;
				font-size:34rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow:ellipsis;
			}
		}
		
		button {
			width: 500rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 40rpx;
			color: #fff;
			background-color: skyblue;
			border-radius: 20rpx;
			margin: 20rpx auto 0;
		}
	}
</style>
