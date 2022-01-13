<template>
  <div class="mp-erp-customer-manage-setup-page-setup-content-comp-wrap">
    <section class="left">
      <header>
        <p class="mp-common-title-wrap">客户信息</p>
      </header>
      <main  v-if="customer">
        <LeftFirstComp :customer="customer" ref="oInfoBox" />
        <LeftSecondComp :customer="customer" ref="oAddressBox" />
      </main>
    </section>
    <section class="right">
      <header>
        <p class="mp-common-title-wrap">营业执照照片</p>
      </header>
      <main  v-if="customer">
        <RightPhotoComp :customer="customer" ref="oLicenseBox" />
      </main>
    </section>
  </div>
</template>

<script>
import LeftFirstComp from './LeftFirstComp.vue';
import LeftSecondComp from './LeftSecondComp.vue';
import RightPhotoComp from './RightPhotoComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
  },
  components: {
    LeftFirstComp,
    LeftSecondComp,
    RightPhotoComp,
  },
  computed: {
  },
  methods: {
    async submit() {
      if (this.$refs.oInfoBox && this.$refs.oAddressBox && this.$refs.oLicenseBox) {
        const [infoResp, addressResp] = await Promise.all([this.$refs.oInfoBox.submitForm(), this.$refs.oAddressBox.submitForm()]).catch(() => []);
        if (!infoResp || !addressResp) return null;
        const { Address, AuthenInfo } = addressResp;
        const LicensePath = this.$refs.oLicenseBox.LicensePath || '';
        const _AuthenInfo = { ...infoResp.AuthenInfo, SellArea: AuthenInfo.SellArea, DetailAddress: AuthenInfo.DetailAddress, LicensePath };
        const temp = { ...infoResp, Address, AuthenInfo: _AuthenInfo };
        return temp;
      }
      return null;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-manage-setup-page-setup-content-comp-wrap {
  height: 100%;
  overflow: hidden;
  display: flex;
  > section {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    flex: none;
    > header {
      flex: none;
      padding: 20px;
    }
    > main {
      flex: 1;
      overflow: hidden;
      > div, > form {
        height: 100%;
        overflow-y: auto;
        display: inline-block;
        width: 430px;
        padding: 0 20px;
        box-sizing: border-box;
        &.customer-second-ruleForm-wrap {
          width: 560px;
        }
      }
    }
    &.left {
      width: 990px;
      > main {
        > div, > form {
          border-right: 1px solid #eee;
        }
      }
    }
  }
}
</style>
