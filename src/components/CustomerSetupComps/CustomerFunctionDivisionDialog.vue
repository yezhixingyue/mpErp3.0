<template>
  <CommonDialogComp
    width="500px"
    top='20vh'
    :title="title"
    :visible.sync="visible"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-customer-setup-page-classify-save-dialog-comp-wrap"
  >
    <ul v-if="localItemData" class="content">
      <li>
        <label for="">分类名称：</label>
        <div>
          <el-input
            size="small"
            maxlength="10"
            v-model.trim="localItemData.CategoryName"
          />
        </div>
      </li>
      <!-- <li>
        <label for="">信誉额度：</label>
        <div>
          <el-input
            size="small"
            maxlength="10"
            v-model.number="localItemData.Value"
          />
        </div>
      </li> -->
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import CustomerSetupItem from '@/assets/js/TypeClass/CustomerSetupItem';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: null,
    },
    list: {
      type: Array,
      default: () => [],
    },
    permissionList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      localItemData: null,
    };
  },
  computed: {
    title() {
      return this.itemData && (this.itemData.CategoryID || this.itemData.CategoryID === 0) ? '编辑分类名称' : '添加分类名称';
    },
  },
  methods: {
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.localItemData = null;
    },
    initEditData() { // 数据初始化方法
      this.localItemData = new CustomerSetupItem(this.itemData);
    },
    checker() {
      if (!this.localItemData) {
        return false;
      }
      if (!this.localItemData.CategoryName) {
        this.messageBox.failSingleError('保存失败', '请输入客户等级名称');
        return false;
      }
      // if (!this.localItemData.Value && this.localItemData.Value !== 0) {
      //   this.messageBox.failSingleError('保存失败', '请输入该等级信誉额度');
      //   return false;
      // }
      if (JSON.stringify(this.itemData) === JSON.stringify(this.localItemData)) {
        this.messageBox.failSingleError('保存失败', '未发生改动');
        return false;
      }
      if (Array.isArray(this.list)) {
        const t = this.list.find(it => it.CategoryName === this.localItemData.CategoryName && it.CategoryID !== this.localItemData.CategoryID);
        if (t) {
          this.messageBox.failSingleError('保存失败', '名称不能重复');
          return false;
        }
      }
      return true;
    },
    onSubmit() {
      if (!this.checker()) return;
      this.$emit('submit', { ...this.localItemData, PermissionList: this.permissionList });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-setup-page-classify-save-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 25px;
    min-height: 135px;
    ul.content {
      > li {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 18px;
        > div {
          width: 240px;
          .el-radio {
            margin-right: 12px;
            position: relative;
            top: 1px;
            .el-radio__label {
              padding-left: 6px;
              font-size: 13px;
            }
          }
          .el-input {
            input {
              border-radius: 0;
              border-top: none;
              border-left: none;
              border-right: none;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 28px;
    padding-top: 0px;
  }
}
</style>
