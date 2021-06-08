<template>
  <div>
    <el-carousel :initial-index='i' @change="onChange"
      class="mp-img-swiper-box" arrow="always" :autoplay="false" indicator-position="none">
      <el-carousel-item v-for="(item,i) in imgList" :key="i">
        <div class="img-box">
          <el-image :src="item"
        :preview-src-list="[item]" @click="onImgClick" alt />
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="fixed-big-img-wrap">
      <el-image
        style="width: 0px; height: 0px"
        ref="showCurImg"
        :src="curImgUrl"
        :preview-src-list="[curImgUrl]">
      </el-image>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    /**
     * 当前展示图片的索引值，必传，用于打开时可以展示指定的图片
     */
    i: {
      type: Number,
      default: 0,
    },
    /**
     * 图片src数组，和父级保持一致
     */
    imgList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      curIndex: 0,
      showBigImg: false,
    };
  },
  computed: {
    curImgUrl() {
      return this.imgList[this.curIndex];
    },
  },
  methods: {
    onImgClick() {
      this.$refs.showCurImg.clickHandler();
      this.showBigImg = true;
    },
    imgJumping(type) {
      if (!type || (type !== 'left' && type !== 'right')) return;
      const wrapper = document.getElementsByClassName('mp-img-swiper-box')[0];
      if (type === 'left') {
        const left = wrapper.getElementsByClassName('el-carousel__arrow--left')[0];
        left.click();
      } else if (type === 'right') {
        const right = wrapper.getElementsByClassName('el-carousel__arrow--right')[0];
        right.click();
      }
    },
    onChange(cur) {
      this.curIndex = cur;
    },
  },
  mounted() {
    this.curIndex = this.i;
    const oBigImg = document.querySelector('.fixed-big-img-wrap .el-image-viewer__canvas > img');
    // const div = document.querySelector('el-image-viewer__actions__inner');
    // console.log(div);
    oBigImg.addEventListener('click', () => {
      this.$refs.showCurImg.closeViewer();
    });
  },
  updated() {
    const oBigImg = document.querySelector('.fixed-big-img-wrap .el-image-viewer__canvas > img');
    oBigImg.addEventListener('click', () => {
      this.$refs.showCurImg.closeViewer();
    });
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-img-swiper-box {
  .el-carousel__item {
    width: 500px;
    height: 320px;
    div.img-box {
      width: 100%;
      height: 320px;
      position: relative;
      img {
        width: 500px;
        height: 320px;
        cursor: zoom-in;
      }
      .el-image-viewer__wrapper{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }
  }
  .el-carousel__arrow {
    &.el-carousel__arrow--left {
      left: -40px;
    }
    &.el-carousel__arrow--right {
      right: -40px;
    }
  }
}
.fixed-big-img-wrap{
  height: 0px !important;
  .el-image-viewer__btn.el-image-viewer__actions{
    bottom: 20vh;
    margin-left: -80px;
    > div {
      &.el-image-viewer__actions__inner > i{
        cursor: pointer !important;
      }
       position: relative;
        &::after {
          content: '删除本张照片';
          font-size: 14px;
          line-height: 44px;
          letter-spacing: 1px;
          text-align: center;
          width: 150px;
          height: 100%;
          color: $--color-white;
          cursor: pointer;
          background-color: #606266;
          position: absolute;
          right: -200px;
          border-radius: 22px;
          // opacity: 0.8;
        }
        // &:hover{
        //   &::after{
        //     opacity: 1;
        //     color:  $--color-white;
        //   }
        // }
    }
    // .el-image-viewer__btn {
    //   .el-image-viewer__actions__inner{
    //  }
    // }
  }
  .el-image-viewer__btn.el-image-viewer__close{
    top: 16vh;
    right: 20vw;
    color: rgb(220, 220, 220);
    opacity: 0.7;
    background-color: #606266;
    &:hover{
      opacity: 1;
    }
  }
  .el-image-viewer__canvas{
    > img {
      cursor: zoom-out;
    }
  }
}
@media screen and (max-width: 1200px) {
  .fixed-big-img-wrap{
    .el-image-viewer__btn.el-image-viewer__close{
      top: 16vh;
      right: 10vw;
    }
  }
}
@media screen and (max-width: 1600px) {
  .fixed-big-img-wrap{
    .el-image-viewer__btn.el-image-viewer__close{
      top: 16vh;
      right: 15vw;
    }
  }
}
@media screen and (max-width: 1000px) {
  .fixed-big-img-wrap{
    .el-image-viewer__btn.el-image-viewer__close{
      top: 16vh;
      right: 5vw;
    }
  }
}

</style>
