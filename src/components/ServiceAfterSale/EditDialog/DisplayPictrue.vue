<template>
  <div class="mp-service-imglist-display-wrap">
    <div class="img-list">
      <span class="img-box" v-for="(item, i) in imgList" :key="'imgbox' + '-' + i">
        <el-image :mpDelPhoto='delViewImage' :mpCloseViewer='closeViewer '
          :preview-src-list='imgList' fit=cover :src="imgList[i]" class="img-item" alt />
        <i v-if="isEditMode" @click="handleDelImgClick(i)"></i>
      </span>
      <span class="img-tips" v-if="imgList.length > 0">点击可查看图片</span>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    /**
     * 需要传入的函数方法： 用于点击图片按钮进行删除
     */
    delFunc: {
      type: Function,
    },
    /**
     * 需要传入图片列表，用于展示，每个项都为img的src地址
     */
    imgList: {
      type: Array,
      default: () => [],
    },
    /**
     * 判断是否为可编辑模式，如果是则可以执行删除等操作，如果不是则只用于展示
     */
    isEditMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showSwiper: false,
      imgIndex: 0,
    };
  },
  methods: {
    go2DelImg() {
      // 弹窗中删除照片
      const { curIndex } = this.$refs.imgSwiper;
      this.handleDelImgClick(curIndex); // 套用上方删除方法，统一设置弹框提示，减少代码冗余
    },
    handleDelImgClick(i) {
      // 照片列表右上角删除功能
      this.messageBox.warnCancelNullMsg('确定删除这张照片吗 ?', () => {
        this.delFunc(i);
        if (this.imgList.length === 0) {
          // 关闭弹窗
        }
      });
    },
    closeViewer() {
      // console.log('图像关闭了');
    },
    delViewImage(i) {
      this.handleDelImgClick(i);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-service-imglist-display-wrap {
  $h: 150px;
  .img-list {
    padding-top: 15px;
    user-select: none;
    .img-item {
      height: 50px;
      width: 90px;
      background-color: #d7eff9;
      object-fit: cover;
      margin-right: 5px;
      cursor: pointer;
    }
    span.img-box {
      position: relative;
      height: 50px;
      display: inline-block;
      font-size: 0;
      > i {
        width: 20px;
        height: 20px;
        background: url("../../../assets/images/imgfloatdel.png") no-repeat
          center;
        background-size: 10px 10px;
        background-color: rgba($color: #000000, $alpha: 0.4);
        content: "";
        position: absolute;
        right: -4px;
        top: -12px;
        border-radius: 50%;
        cursor: pointer;
        pointer-events: auto;
        z-index: 10;
        opacity: 0;
        transition: 0.1s;
      }
      &:hover {
        i {
          opacity: 1;
        }
      }
    }
    span.img-tips {
      font-size: 12px;
      color: $--color-text-secondary;
      margin-left: 16px;
      vertical-align: 30%;
      display: inline-block;
    }
  }
  .el-image-viewer__btn.el-image-viewer__actions{
    bottom: 20vh;
    // margin-left: -80px;
    background: transparent;
    > div {
      &.el-image-viewer__actions__inner > i{
        cursor: pointer !important;
      }
      background-color: #606266;
      padding: 0 28px;
      border-radius: 22px;
    }
    // display: flex;
    width: 500px;
    > .mp-el-del-btn{
      width: 240px;
      height: 44px;
      display: inline-block;
      color: #fff;
      background-color: #606266;
      padding: 0 20px;
      border-radius: 22px;
      font-size: 14px;
      line-height: 44px;
      text-align: center;
      margin-left: 35px;
      letter-spacing: 1px;
      &:hover{
        color: $--color-primary;
      }
    }
  }
  .el-image-viewer__btn.el-image-viewer__close{
    color: rgb(220, 220, 220);
    opacity: 0.7;
    &:hover{
      opacity: 1;
    }
  }
}
</style>
