<template> <!-- 售后单列表查看详情页面 -->
  <el-dialog
    title="售后处理"
    :visible.sync="isShowServiceDetail"
    width="1000px"
    :modal='false'
    custom-class="dialog-to-servicelist-detail mp-img-style-header"
    top="6vh"
    center :close-on-press-escape='false'
    :before-close="handleClose"
    v-dialogDrag
  >
    <template v-if="!isLoading">
      <OrderServiceDetailCord isSelectPage :orderData='curServiceOrdrData'
        :orderDetailData='orderDetailData'
        :curProductInfoStringify='curProductInfoStringify' />
      <!-- 顶部信息 -->
      <section class="question-photo">
        <!-- 问题照片 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/photo.png')" title="问题照片" />
        </header>
        <main>
          <div v-if="backImgList.length <= 0" class="placeholder-box">
              <img src="@/assets/images/nullImg.png" alt="">
              <span class="explain">未上传问题照片</span>
          </div>
          <DisplayPictrue v-else :isEditMode='false' :imgList='backImgList' />
        </main>
      </section>

      <section class="service-after-sale" v-if="curServiceOrdrData">
        <!-- 售后处理 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/service2.png')" title="售后处理" />
        </header>
        <main :class="isFinish ? '' : ''"> <!-- 'op' -->
          <ShowDetailTable :h='h1' ref="detailTopTable" :tableData='curServiceOrdrData.PackageList'
            :LossAmount='curServiceOrdrData.LossAmount' @getHeight='getHeight' />
          <ServiceDetailBottomList
            ref="detailBottomList"
            :curServiceOrdrData='curServiceOrdrData'
            @getHeight='getHeight'
           />
        </main>
      </section>

      <span slot="footer" class="dialog-footer">
          <normalBtn @click.native="handleClose" title="关闭" />
      </span>
    </template>
    <LoadingComp v-else />
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import OrderServiceDetailCord from '@/components/ServiceAfterSale/EditDialog/OrderServiceDetailCord.vue';
import VTypeTitle from '@/components/ServiceAfterSale/EditDialog/VTypeTitle.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import DisplayPictrue from '@/components/ServiceAfterSale/EditDialog/DisplayPictrue.vue';
import ShowDetailTable from '@/components/ServiceAfterSale/EditDialog/ShowDetailTable.vue';
import ServiceDetailBottomList from '@/components/ServiceAfterSale/EditDialog/ServiceDetailBottomList.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';

export default {
  components: {
    normalBtn,
    OrderServiceDetailCord,
    VTypeTitle,
    DisplayPictrue,
    ShowDetailTable,
    // XTypeTitle,
    LoadingComp,
    ServiceDetailBottomList,
  },
  data() {
    return {
      h1: 356,
      isFinish: false,
    };
  },
  computed: {
    ...mapState('orderModule', ['orderDetailData']),
    ...mapGetters('orderModule', ['curProductInfoStringify']),
    ...mapState('service', ['isShowServiceDetail', 'backImgList', 'curServiceOrdrData']),
    ...mapState('common', ['isLoading']),
  },
  methods: {
    ...mapMutations('service', ['setIsShowServiceDetailClose']),
    handleClose() { // 弹窗关闭图标功能
      this.setIsShowServiceDetailClose();
    },
    getHeight() { // 该函数用于根据数据长度动态切换表格和信息区域的高度
      if (!this.$refs.detailBottomList
        || !this.$refs.detailTopTable
        || !this.isShowServiceDetail) return;
      const bottomDiv = document.getElementsByClassName('question-content')[0];
      const topDiv = document.getElementsByClassName('mp-service-detail-table-wrap')[0];
      if (!topDiv) return;
      const topH = topDiv.offsetHeight;
      const botH = this.$refs.detailBottomList.offsetHeight;
      if (topH + botH < 356) {
        this.isFinish = true;
        return;
      }
      const difference = topH + botH - 356;
      const h1 = 239;
      const h2 = 117;
      if (topH > h1 && botH > h2) {
        bottomDiv.style.maxHeight = '70px';
        this.h1 = 239;
        this.isFinish = true;
        return;
      }
      if (topH > h1 && botH < h2) {
        this.h1 = topH - difference;
      }
      if (topH < h1 && botH > h2) {
        const num = botH - difference - 47;
        bottomDiv.style.maxHeight = `${num}px`;
      }
      this.isFinish = true;
    },
  },
  watch: {
    // curServiceOrdrData(newVal) {
    //   console.log(newVal, 'newVal');
    //   if (!newVal) return;
    //   // setTimeout(this.getHeight, 200);
    //   this.$nextTick(() => {
    //     console.log('nextTick, getHeight');
    //     this.getHeight();
    //   });
    // },
    isShowServiceDetail(newVal) {
      if (!newVal) this.isFinish = false;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.dialog-to-servicelist-detail {
  height: 800px;
  .el-dialog--center .el-dialog__body{
    text-align: left;
  }

  .el-dialog__header > span::before {
    background: url(../../../assets/images/service.png) no-repeat center;
  }

  .el-dialog__body {
    box-sizing: border-box;
    height: 695px;
    padding: 0%;
    padding-top: 20px;
    position: relative;
    > section {
      margin-left: 20px;
      width: 960px;
      box-sizing: border-box;
      &.question-photo {
        display: flex;
        height: 90px;
        align-items: center;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          text-align: left;
          height: 100%;
          width: 85px;
          padding-top: 16px;
          box-sizing: border-box;
          > div {
            margin: 0 auto;
          }
        }
        > main {
          margin-bottom: 16px;
          padding-left: 20px;
          padding-top: 5px;
          .placeholder-box{
            margin-left: 26px;
            padding-top: 25px;
            > img {
                width: 50px;
                height: 41px;
                vertical-align: -100%;
            }
            .explain {
              font-size: 12px;
              color: $--color-text-table-time;
              margin-left: 20px;
            }
          }
          .el-image-viewer__btn.el-image-viewer__actions{
            width: 360px;
          }
          .mp-el-del-btn{
            display: none;
          }
        }
      }
      &.service-after-sale {
        height: 395px;
        display: flex;
        margin-top: 20px;
        box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
        border-radius: 5px;
        border: solid 1px $--border-color-light;
        > header {
          height: 100%;
          width: 85px;
          flex: none;
          > div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        > main {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          margin-top: 17px;
          margin-bottom: 20px;
          font-size: 12px;
          > div.el-table {
            &::after, &::before{
              display: none;
            }
            flex: none;
          }
          &.op{
            opacity: 0;
          }
          > div.question-text-info {
            box-sizing: border-box;
            padding-bottom: 10px;
            padding-top: 15px;
            border: 1px solid #eeeeee;
            width: 835px;
            > div.question-list{
              display: flex;
              // max-height: 70px;
              // overflow: auto;
              > div{
                padding-top: 1px;
                margin-right: 3px;
              }
              > ul{
                overflow: auto;
                width: 771px;
                max-height: 160px;
                > li{
                  line-height: 14px;
                  margin-bottom: 6px;
                  text-align: left;
                  padding-bottom: 4px;
                  border-bottom: 1px dashed #eee;
                  display: flex;
                  margin-right: 20px;
                  overflow: hidden;
                  > .question-type{
                    min-width: 80px;
                    display: inline-block;
                    margin-left: 2px;
                    line-height: 16px;
                  }
                  .question-mark-title{
                    margin-right: 3px;
                  }
                  .is-gray{
                    max-width: 600px;
                    overflow: hidden;
                    display:inline-block;
                    vertical-align: -15%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &.Remark {
                      margin-right: 28px;
                    }
                  }
                  > div {
                    padding-top: 1px;
                    display: flex;
                    overflow: hidden;
                    width: 663px;
                    > div {
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      flex: 1;
                      display: flex;
                      &:first-of-type {
                        min-width: 500px;
                      }
                    }
                    // flex-wrap: wrap;
                  }
                }
              }
            }
            > div.solution{
              padding-top: 6px;
              text-align: left;
              padding-left: 10px;
              // margin-right: 18px;
              display: flex;
              line-height: 16px;
              > span {
                margin-left: -10px;
                flex: none;
              }
              > div {
                font-size: 12px;
                padding-right: 10px;
                .is-gray{
                  margin-left: 10px;
                }
                .re-print-box {
                  margin-left: 20px;
                }
                max-height: 80px;
                overflow: overlay;
              }
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 20px 20px 14px 20px;
    .dialog-footer {
      width: 100%;
      display: inline-block;
        button {
          width: 120px;
          height: 29px;
          border-radius: 2px;
          margin: 0;
        }
    }
  }
}
</style>
