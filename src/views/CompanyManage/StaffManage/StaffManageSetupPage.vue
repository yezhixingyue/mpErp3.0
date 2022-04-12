<template>
  <section v-if="staffForm" class="mp-erp-staff-manage-setup-page-wrap">
    <main>
      <LRWidthDragAutoChangeComp leftWidth='450px'>
        <template v-slot:left>
          <StaffSetupLeftComp :staffForm='staffForm' :RosterDataList='RosterDataList' @change="changeFormItem" ref="oLeft" />
        </template>
        <template v-slot:right>
          <div class="right-content-img-upload-box">
            <p class="mp-common-title-wrap">员工照片</p>
            <LicensePathPhotoComp v-model="staffForm.HeadPic" :options="photoOptions" @error="onImgLoadError" @change="onImgChange" cutting />
          </div>
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button class="cancel-blue-btn" @click="goback">＜＜ 返回</el-button>
    </footer>
  </section>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import LicensePathPhotoComp from '@/components/CustomerManageComps/SetupContentComps/LicensePathPhotoComp';
import Staff from '../../../assets/js/TypeClass/StaffManage/Staff';
import StaffSetupLeftComp from '../../../components/StaffManageComp/StaffSetupLeftComp.vue';

export default {
  name: 'StaffManageSetupPage',
  components: {
    StaffSetupLeftComp,
    LicensePathPhotoComp,
    LRWidthDragAutoChangeComp,
  },
  data() {
    return {
      staffForm: null,
      RosterDataList: null,
      photoOptions: {
        width: 250,
        height: 350,
        limitWidth: 250,
        limitHeight: 350,
        title: '员工',
        fit: 'cover',
      },
      HeadPicError: false,
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
    changeFormItem([[key1, key2], val]) {
      if (!this.staffForm || !key1) return;
      if (key2) {
        this.staffForm[key1][key2] = val;
      } else {
        this.staffForm[key1] = val;
      }
    },
    async submit() {
      if (!this.$refs.oLeft) return;
      const result = await this.$refs.oLeft.submitForm();
      if (!result) return;
      if (!this.staffForm.HeadPic || this.HeadPicError) {
        this.messageBox.failSingleError('保存失败', '请上传员工照片');
        return;
      }
      // 信息提取转换(性别、出生日期)
      const temp = this.staffForm.transformToSubmit();
      if (!temp) {
        this.messageBox.failSingleError('保存失败', '身份证号解析失败');
        return;
      }
      // 提交
      const resp = await this.api.getStaffBaseInfoSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          sessionStorage.setItem('needFetchStaffList', true);
          this.goback();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    goback() {
      this.$goback();
    },
    onImgLoadError() {
      this.HeadPicError = true;
    },
    onImgChange() {
      this.HeadPicError = false;
    },
  },
  mounted() {
    this.init();
    this.api.getRosterDataList().then(res => {
      if (res?.data?.Data) {
        this.RosterDataList = res.data.Data;
      }
    });
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
    overflow: hidden;
    .right-content-img-upload-box {
      padding-left: 120px;
      > p.mp-common-title-wrap {
        padding-bottom: 25px;
      }
    }
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
