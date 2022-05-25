<template>
  <CommonDialogComp
    width="560px"
    top="18vh"
    title="设置内部网络IP"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="visible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-white-staff-setup-dialog-wrap"
  >
    <!-- 内容区 -->
    <el-input
      type="textarea"
      :rows="8"
      maxlength="750"
      v-model.trim="Content"
      placeholder="请输入IP地址">
    </el-input>
    <p class="tips-box">请输入允许访问的IP地址，多个地址以逗号进行间隔，最多可设置50个IP。</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      Content: '',
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    onOpen() {
      this.getIntranetContent();
    },
    onClosed() {
    },
    async onSubmit() {
      const temp = { Content: this.Content };
      const resp = await this.api.getIntranetSetup(temp).catch(() => null);
      if (resp?.data.Status === 1000) {
        const cb = () => {
          this.visible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
    async getIntranetContent() {
      const resp = await this.api.getIntranetContent().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.Content = resp.data.Data || '';
      } else {
        this.Content = '';
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-white-staff-setup-dialog-wrap {
  .el-dialog__body {
    padding: 30px 25px;
    .tips-box {
      width: 510px;
      letter-spacing: 0.5px;
      margin-top: 10px;
      padding-left: 14px;
    }
    .el-textarea__inner {
      font-size: 13px;
    }
  }
}
</style>
