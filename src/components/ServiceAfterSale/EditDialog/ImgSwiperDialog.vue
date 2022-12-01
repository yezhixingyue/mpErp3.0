<template>
  <el-dialog
  :visible.sync="showImgSwiper"
  :modal='false'
  class="mp-service-img-swiper-dialog"
  :before-close="handleClose"
  width="600px">
  <ImgSwiperBox />
  <span>这是一段信息</span>
</el-dialog>
</template>

<script>
// 暂时作废
import { mapState, mapMutations } from 'vuex';
import ImgSwiperBox from '@/components/ServiceAfterSale/EditDialog/ImgSwiperBox.vue';

export default {
  components: {
    ImgSwiperBox,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    ...mapState('service', ['showImgSwiper']),
    ...mapMutations('service', ['setShowImgSwiperTrue', 'setShowImgSwiperFail']),
  },
  methods: {
    handleClose() {
    //  console.log(this.setShowImgSwiperFail, this.setShowImgSwiperTrue);
      this.setShowImgSwiperFail();
    },
  },
};
</script>

<style lang='scss'>
.mp-service-img-swiper-dialog{
  background-color: rgba($color: #000000, $alpha: 0);
  .el-dialog{
    height: 350px;
    background-color: rgba($color: #000000, $alpha: 0);
  }
}
</style>
