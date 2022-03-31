
<template>
  <CommonDialogComp
    width="500px"
    top='20vh'
    :title="localItemData?localItemData.CategoryName + '权限设置' :'' + '权限设置'"
    :visible.sync="visible"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    @submit="onSubmit"
    class="mp-erp-customer-setup-page-classify-save-dialog-comp-wrapa"
  >
    <ul v-if="localItemData" class="content">
      <li>
        <div>
           <el-checkbox v-for="item in localItemData.PermissionList" :key="item.Key" v-model="item.HavePermission">{{item.Name}}</el-checkbox>
        </div>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
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
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      localItemData: null,
      checkList: true,
    };
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
      if (JSON.stringify(this.itemData) === JSON.stringify(this.localItemData)) {
        this.messageBox.failSingleError('保存失败', '未发生改动');
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.checker()) return;
      this.$emit('submit', this.localItemData);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-setup-page-classify-save-dialog-comp-wrapa {

  .el-dialog__body {
    padding-left: 30px;
    padding-bottom: 10px;
    padding-top: 25px;
    min-height: 135px;
    ul.content {
      > li {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        margin-top: 18px;
        > span{
          line-height: 20px;
          margin-right: 10px;
        }
        > div {
          width: 400px;
          height: 100px;
          overflow: auto;
          .el-checkbox{
            margin-bottom: 10px;
            width: 25%;
          }
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
