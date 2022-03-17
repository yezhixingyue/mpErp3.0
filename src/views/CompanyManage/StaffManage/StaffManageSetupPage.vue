<template>
  <section v-if="staffForm" class="mp-erp-staff-manage-setup-page-wrap">
    <main>
      <StaffSetupLeftComp :staffForm='staffForm' @change="handleFormChange" ref="oLeft" />
    </main>
    <footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button class="cancel-blue-btn">＜＜ 返回</el-button>
    </footer>
  </section>
</template>

<script>
import Staff from '../../../assets/js/TypeClass/StaffManage/Staff';
import StaffSetupLeftComp from '../../../components/StaffManageComp/StaffSetupLeftComp.vue';

export default {
  name: 'StaffManageSetupPage',
  components: {
    StaffSetupLeftComp,
  },
  data() {
    return {
      staffForm: null,
    };
  },
  methods: {
    async init() {
      if (this.$route.params.id === 'null') { // 新增
        this.staffForm = new Staff();
      } else { // 编辑
        const temp = {
          ID: this.$route.params.id,
          FieldType: 3,
        };
        const resp = await this.api.getStaffList(temp).catch(() => null);
        if (resp && resp.data.Status === 1000 && resp.data.Data?.[0]) {
          this.staffForm = new Staff(resp.data.Data[0]);
        }
      }
    },
    handleFormChange([[key1, key2], val]) {
      if (!this.staffForm || !key1) return;
      if (key2) {
        this.staffForm[key1][key2] = val;
      } else {
        this.staffForm[key1] = val;
      }
    },
    async submit() {
      if (!this.$refs.oLeft) return;
      console.log(await this.$refs.oLeft.submitForm());
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-setup-page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  > main {
    flex: 1;
  }
  > footer {
    flex: none;
    height: 100px;
    box-sizing: border-box;
    padding-top: 35px;
    width: 450px;
    text-align: center;
    button {
      width: 100px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
