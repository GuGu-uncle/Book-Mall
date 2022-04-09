<template>
	<view>
		<u-upload
			:fileList="fileList1"
			@afterRead="afterRead"
			@delete="deletePic"
			name="1"
			multiple
			:maxCount="1"
		>
			<u--image
				shape="circle" 
				:showLoading="true" 
				:src="user.avatar_url||'../../static/logo.png'"
				width="160rpx" 
				height="160rpx"
			></u--image>
		</u-upload>
	</view>
</template>

<script>
	import {apiOssToken,apiUpdateUserAvatar} from '@/config/api.js'
	import {updateUser} from '@/config/utils.js'
	export default {
		data() {
			return {
				user:{},
				fileList1: [],
				ossToken:'',
				fileName:''
			}
		},
		onLoad() {
			this.user=uni.getStorageSync('user')
		},
		methods:{
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 获取阿里云OSS Token
				this.ossToken = await apiOssToken()
				// #ifdef H5
				// H5获取上传的文件名
				let file = event.file[0].name
				// #endif
				//#ifndef H5
				// 非H5获取上传的文件名
				let file = event.file[0].path
				//#endif
				// 将文件名变成 唯一标识 + 文件名后缀
				this.fileName = uni.$u.guid(20) + file.slice(file.lastIndexOf('.'))
				console.log(this.ossToken)
				console.log(this.fileName)
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(this.ossToken.host,lists[i].url,this.fileName)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url,fileUrl,fileName) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: url, // 仅为示例，非真实的接口地址
						filePath: fileUrl,
						name: fileName,
						formData: {
							"policy": this.ossToken.policy,
							"OSSAccessKeyId": this.ossToken.accessid,
							"success_action_status": "200",
							"signature": this.ossToken.signature
						},
						success: (res) => {
							// 更新头像
							// apiUpdateUserAvatar({avatar:this.fileName})
							// 更新本地中的用户信息
							// updateUser()
							console.log("成功")
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			}
		}
	}
</script>

<style>

</style>
