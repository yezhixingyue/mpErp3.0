<template>

 <CommonDialogComp
   title="售后评价"
   :visible.sync="visible"
   @cancle="cancle"
   @open='onOpen'
   @closed='closed'
   submitText='确定'
   :showCancel='false'
   @submit='submit'
   width='800px'
   >
   <div slot="title" class="title">aaa</div>
   <el-form label-position="left" ref="form" :model="SeeEstimate" class="see-estimate">
     <template v-if="SeeEstimate">
       <el-form-item label="服务评分：">
         <el-rate disabled show-text v-model="SeeEstimate.Score" :texts="['非常差', '差', '一般', '好', '非常好',]"></el-rate>
       </el-form-item>
       <el-form-item label="服务结果：">
         <div class="result">
           <span v-if="SeeEstimate.Result === 1">问题已解决</span>
           <span v-else>问题未解决</span>
         </div>
       </el-form-item>
       <el-form-item label="服务标签：">
         <span>
           {{SeeEstimate.LabelTitle.join()}}
         </span>
       </el-form-item>
       <el-form-item label="售后评价：">
         <span>{{SeeEstimate.EvaluateContent}}</span>
       </el-form-item>
       <el-form-item label="评价晒图：">
         <div class="images">
           <el-image v-for="item in SeeEstimate.EvaluatePicList" :key="item"
             :src="item"
             fit="cover"></el-image>
         </div>
       </el-form-item>
     </template>
   </el-form>
 </CommonDialogComp>

</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  components: {
    CommonDialogComp,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    AfterSaleCode: {
      type: Number,
    },
  },

  data() {
    return {
      SeeEstimate: null,
    };
  },
  methods: {
    onOpen() {},
    cancle() {
      this.closed();
    },
    closed() {
      this.$emit('closed');
    },
    submit() {
      this.$emit('submit');
    },
  },
  watch: {
    visible(n) {
      if (n) {
        this.api.getOrderAfterSaleEvaluateDetail(this.AfterSaleCode).then(res => {
          if (res.data.Status === 1000) {
            this.SeeEstimate = res.data.Data;
          }
        });
      }
    },
  },
  mounted() {
    // console.log(this.AfterSaleCode);
  },
};
</script>

<style lang='scss'>

  .see-estimate{
    min-height: calc(400px);
    .el-rate{
      margin-top: 10px;
    }
    .result{
      span{
        font-weight: 700;
      }
    }
    .images{
      display: flex;
      flex-wrap: wrap;
        max-height: 200px;
      .el-image{
        width: 100px;
        height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
</style>
