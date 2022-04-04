<template>
	<view class='container'>
		<!-- 轮播图 -->
		<view>
			<u-swiper
					:list="slidesImg"
					keyName="img_url"
					showTitle
					height="320rpx"
					@change="e => current = e.current"
					autoplay
			>
				<view
						slot="indicator"
						class="indicator"
				>
					<view
							class="indicator__dot"
							v-for="(item, index) in slidesImg"
							:key="item.id"
							:class="[index === current && 'indicator__dot--active']"
					>
					</view>
				</view>
			</u-swiper>
		</view>
		
		<!-- 导航 -->
		<u-tabs 
			class="navigation" 
			:list="classification" 
			:scrollable='false' 
			lineWidth="80rpx"
			@click="commodityClassification"
		></u-tabs>
		
		<!-- 商品 -->
		<view class="goods">
			<!-- 加载动画 -->
			<view class="loading" v-show="!indexList.length">
				<u-loading-icon 
					size="100rpx"
					text="加载中" 
					textSize="40rpx"
					:vertical="true"
					:show="!indexList.length"
				></u-loading-icon>
			</view>
			<!-- 商品列表 -->
		    <u-grid
					:border="false"
					@click="click"
					col="2"
			>
				<u-grid-item
						v-for="(item,index) in indexList"
						:key="index"
				>
					<u-icon
							:customStyle="{paddingTop:20+'rpx'}"
							:size="22"
					></u-icon>
					<!-- 自定义组件 -->
					<goods-cart :goods="item"></goods-cart>
				</u-grid-item>
			</u-grid>
		</view>
	</view>
</template>

<script>
	import {apiIndex, apiLogin,apiUserInfo} from '../../config/api.js';
	export default {
		data() {
			return {
				slidesImg:[],
				current:0,//轮播图圆点默认第一个亮
				classification:[
					{name:'默认'},
					{name:'销量'},
					{name:'推荐'},
					{name:'最新'}
				],
				indexList:[],
				index:0,//展示商品分类
				page:1//商品页数
			}
		},
		async onLoad() {
			const res=await apiIndex()
			this.slidesImg=res.slides
			this.indexList=res.goods.data
		},
		methods: {
			
			// 获取分类商品
			commodityClassification(classification){
				this.index=classification.index
				// 将商品列表置为空
				this.indexList=[]
				// 将页数置为1
				this.page=1
				// 获取商品列表
				this.addGoods()
			},
			// 增加商品列表
			async addGoods(){
				let page=this.page
				if(this.index===0) this.indexList.push(...(await apiIndex({page})).goods.data)
				if(this.index===1) this.indexList.push(...(await apiIndex({sales:1,page})).goods.data)
				if(this.index===2) this.indexList.push(...(await apiIndex({recommend:1,page})).goods.data)
				if(this.index===3) this.indexList.push(...(await apiIndex({new:1,page})).goods.data)
				this.page++
			},
		},
		async onReachBottom(){
			// 增加商品列表
			this.addGoods()
		}
	}
</script>

<style lang="scss">
	.container{
		padding:20rpx;
	}
	
	
	// 轮播图
	.indicator {
		@include flex(row);
		justify-content: center;

		&__dot {
			 height: 6px;
			 width: 6px;
			 border-radius: 100px;
			 background-color: rgba(255, 255, 255, 0.35);
			 margin: 0 5px;
			 transition: background-color 0.3s;
	
			&--active {
				 background-color: #ffffff;
			 }
		}
	}
	
	
	// 导航
	.navigation{
		margin:40rpx 0 0 0;
	}
	
	
	// 商品
	.loading{
		margin-top:100rpx
	}
</style>
