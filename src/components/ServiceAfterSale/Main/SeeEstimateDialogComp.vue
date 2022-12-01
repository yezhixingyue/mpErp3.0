<template>

 <CommonDialogComp
   title="评价详情"
   :visible="visible"
   @cancle="cancle"
   @open='onOpen'
   @closed='closed'
   submitText='确定'
   :showCancel='false'
   @submit='submit'
   width='800px'
   top='15vh'
   class="see-estimate-dialog"
   >
   <div class="see-estimate">
    <el-form label-position="left" ref="form" :model="SeeEstimate" >
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
            {{SeeEstimate.LabelTitle.join('，')}}
          </span>
        </el-form-item>
        <el-form-item label="评价内容：">
          <div style="display:flex;line-height:34px;margin-top:3px">{{SeeEstimate.EvaluateContent || '未填写评价'}}</div>
        </el-form-item>
        <!-- <el-form-item label="评价晒图：">
          <div class="images">
            <el-image
            :preview-src-list="SeeEstimate.EvaluatePicList" :mpCloseViewer='closeViewer'
            v-for="item in SeeEstimate.EvaluatePicList" :key="item"
              :src="item"
              fit="cover"></el-image>
            <span v-if="SeeEstimate.EvaluatePicList.length === 0">未上传图片</span>
          </div>
        </el-form-item> -->
        <el-form-item label="评价时间：">
          <span>{{SeeEstimate.EvaluateTime | formatDate}}</span>
        </el-form-item>
      </template>
    </el-form>
    <div class="contact-info" v-if="AfterSaleData">
      <span>联系人：{{AfterSaleData.ContactName}}</span>
      <span>手机：{{AfterSaleData.Mobile}}</span>
      <span v-if="AfterSaleData.QQ">QQ：
        <a
        :href="`tencent://message/?uin=${AfterSaleData.QQ}&amp;Site=${AfterSaleData.ContactName}&amp;Menu=yes`" class="details" style="padding:0">
          {{AfterSaleData.QQ}}
        </a>
      </span>
    </div>
   </div>
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
    AfterSaleData: {
      type: Object,
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
    closeViewer() {},
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
        this.api.getOrderAfterSaleEvaluateDetail(this.AfterSaleData.AfterSaleCode).then(res => {
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
.see-estimate-dialog{
  .el-dialog__header{
    padding-left: 30px;
    padding-right: 30px;
  }
  .el-dialog__header::after{
    width: calc(100% - 60px);
    left: 30px;
  }
  .el-dialog__body{
    padding: 30px;
  }
  .see-estimate{
    min-height: calc(300px);
    .el-form-item{
      margin: 0;
      .el-form-item__label{
        width: 82px;
      }
    }
    .el-rate{
      margin-top: 10px;
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
    .contact-info{
      border-top: 1px solid #eee;
      // color: #444;
      padding-top: 22px;
      margin-top: 9px;
      >span{
        margin-right: 18px;
        .details{
          color: #26BCF9;
          padding: 0 10px;
          text-decoration:none
        }
        .details:hover{
          cursor: pointer;
        }
      }
    }
  }
}
</style>
