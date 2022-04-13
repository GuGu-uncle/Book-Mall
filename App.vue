<script>
	export default {
		globalData: {  
			userName:''
		},
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* uview-ui */
	@import "uview-ui/index.scss";
	// iconfont
	@import '@/static/iconfont/iconfont.css'
</style>
