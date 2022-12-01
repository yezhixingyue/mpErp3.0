<template>
  <CommonDialogComp
    width="600px"
    title="设置默认分配组"
    :visible.sync="localVisible"
    class="mp-erp-review-allocation-list-page-header-default-strategy-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    top="18vh"
  >
    <el-radio-group v-model="id">
      <el-radio v-for="it in list" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
    </el-radio-group>
    <p class="ft-12 is-pink tips-box" v-if="list.length===0"> <i class="el-icon-warning"></i> 暂无数据</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    return {
      id: '',
    };
  },
  methods: {
    onOpen() {
      this.id = this.value;
    },
    async submit() {
      if (!this.id) {
        this.messageBox.failSingleError('保存失败', '请选择分组');
        return;
      }
      const resp = await this.api.getDefaultDistrubutionSetup(this.id).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$emit('input', this.id);
          this.localVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    cancel() {
      this.localVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-allocation-list-page-header-default-strategy-wrap {
  .el-dialog__body {
    padding-top: 25px;
    padding-bottom: 55px;
    min-height: 160px;
    max-height: 260px;
    overflow: auto;
    overflow: overlay;
    .el-radio {
      margin-bottom: 8px;
      margin-right: 12px;
      .el-radio__label {
        font-size: 12px;
        width: 8em;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: -1px;
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 30px;
  }
}
</style>
