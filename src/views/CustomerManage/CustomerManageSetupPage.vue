<template>
  <section class="mp-erp-customer-manage-setup-page-wrap">
    <main>
      <CustomerSetupContent :customer="curCustomerData" ref="oContentWrap" :isEdit='isEdit' />
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import Customer from '@/store/customerManage/Customer';
import CustomerSetupContent from '../../components/CustomerManageComps/SetupContentComps/CustomerSetupContent.vue';

export default {
  name: 'CustomerManageSetupPage',
  components: {
    CustomerSetupContent,
  },
  data() {
    return {
      curCustomerData: null,
      loading: false,
      isEdit: true,
    };
  },
  methods: {
    async getInitData() {
      this.loading = true;
      if (this.$route.params.ID && this.$route.params.ID !== 'null') {
        const resp = await this.api.getCustomerList({ ID: this.$route.params.ID, FieldType: 3 }).catch(() => null);
        if (resp && resp.data.Status === 1000 && resp.data.Data && resp.data.Data.length === 1) {
          const [temp] = resp.data.Data;
          this.curCustomerData = new Customer(temp);
        }
      } else {
        this.curCustomerData = new Customer();
        this.isEdit = false;
      }
      this.loading = false;
    },
    onGoBackClick() {
      this.$goback();
    },
    async onSubmitClick() {
      // 需要先校验
      if (this.$refs.oContentWrap && typeof this.$refs.oContentWrap.submit === 'function') {
        const data = await this.$refs.oContentWrap.submit();
        if (data) {
          const resp = await this.api.getCustomerCreate(data).catch(() => null);
          if (resp && resp.data.Status === 1000) {
            const isEdit = !!this.curCustomerData.CustomerID;
            const title = isEdit ? '编辑成功' : '新增成功';
            const cb = () => {
              this.$store.commit('customerManage/setCustomerItemSave', [{ ...data, CustomerID: resp.data.Data }, isEdit]);
              this.onGoBackClick();
            };
            this.messageBox.successSingle(title, cb, cb);
          }
        }
      }
    },
  },
  mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-manage-setup-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 1420px;
  > main {
    flex: 1;
  }
  > footer {
    flex: none;
    height: 65px;
    text-align: center;
    padding-top: 40px;
    width: 1280px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
