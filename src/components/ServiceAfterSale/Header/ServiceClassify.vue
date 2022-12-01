<template>
  <div class="mp-service-header-service-classify-wrap">
      <span class="mp-head-page-title">售后类型：</span>
      <SingleRadio :defaultRadio='0'
        :watchValue='obj4RequestServiceList.Type' :handleSwitch='handleSwitch' :list='radioList' />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import SingleRadio from '@/components/common/SingleRadio.vue';

export default {
  components: {
    SingleRadio,
  },
  data() {
    return {
      radioList: [{ value: '不限', type: true }, { value: '退款', type: true }, { value: '补印', type: true }, { value: '赠送优惠券', type: true }],
    };
  },
  computed: {
    ...mapState('service', ['obj4RequestServiceList', 'serviceTypeList']),
  },
  methods: {
    ...mapMutations('service', ['setServiceType']),
    ...mapActions('service', ['getServiceListData']),
    handleSwitch(e) {
      if (e !== 0) {
        for (let i = 0; i < this.serviceTypeList.length; i += 1) {
          if (this.serviceTypeList[i].Name === this.radioList[e].value) {
            this.setServiceType(this.serviceTypeList[i].ID);
            break;
          }
        }
      } else {
        this.setServiceType('');
      }
      this.getServiceListData();
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-service-header-service-classify-wrap{
  padding-left: 20px;
  padding-top: 25px;
  .mp-head-page-title{
    font-size: 14px;
    color: $--color-text-primary;
    font-weight: 600;
    width: 70px;
    display: inline-block;
    margin-right: 12px;
  }
  .mp-single-radio-wrap {
    margin-right: 10px;
  }
  .el-radio {
    margin-right: 18px;
  }
  .el-radio__label{
    font-size: 14px;
    color: $--color-text-regular;
  }
}
</style>
