<template>
  <CommonDialogComp
    width="650px"
    top='18vh'
    title="设置尺寸组"
    cancelText='关闭'
    :visible.sync="visible"
    :disabled='ElementGroup.length === 0 || canUseGroupData.length === 0'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-size-group-set-dialog-comp-wrap"
   >
    <p v-if="ElementGroup.length === 0 && !loading" class="empty-element-group is-pink">
      <i class="el-icon-warning"></i>
      <span class="is-font-size-12">当前产品或部件尚未设置元素组，请先设置元素组才可添加!</span>
    </p>
    <p v-else-if="canUseGroupData.length === 0 && !loading" class="is-origin">
      <i class="el-icon-warning"></i>
      <span style="font-size:13px;letter-spacing:1px">当前产品或部件尚没有合适的元素组可设置（1. 元素组使用次数须为1-1，2. 不能包含开关元素或多选选择项元素， 3. 不能包含选项数量为0的选择项元素）</span>
    </p>
    <template v-else-if="ruleForm && !loading">
      <el-radio-group v-model="ruleForm.GroupInfo.ID">
        <el-radio :label="it.ID" v-for="it in canUseGroupData" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <div class="footer">
        <el-checkbox v-model="ruleForm.Allow">允许自定义尺寸</el-checkbox>
        <el-checkbox v-show="ruleForm.Allow" v-model="ruleForm.AllowCustomer">允许客户自定义</el-checkbox>
        <el-checkbox v-show="ruleForm.Allow" v-model="ruleForm.IsCheckedCustomize">默认选中自定义</el-checkbox>
        <el-checkbox v-show="ruleForm.Allow && ruleForm.AllowCustomer" v-model="ruleForm.IsCheckedCustomerCustomize">客户默认选中自定义</el-checkbox>
      </div>
    </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: null,
    },
    PositionID: {
      type: String,
      default: '',
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      ElementGroup: [],
      loading: false,
      ruleForm: null,
    };
  },
  computed: {
    canUseGroupData() {
      if (this.ElementGroup.length === 0) return [];
      const list = this.ElementGroup.filter(group => {
        const { ElementList, UseTimes } = group;
        const { MinValue, MaxValue } = UseTimes;
        if (MinValue !== 1 || MaxValue !== 1) return false;
        const t = ElementList.find(it => {
          const { Type, OptionAttribute } = it;
          if (Type === 3) return true;
          if (Type === 2 && OptionAttribute) return OptionAttribute.OptionList.length === 0 || !OptionAttribute.IsRadio;
          return false;
        });
        return !t;
      });

      return list;
    },
  },
  methods: {
    onSubmit() {
      if (!this.ruleForm.GroupInfo.ID) {
        this.messageBox.failSingle('请选择元素组');
        return;
      }
      if (this.value && this.value.GroupInfo
       && this.ruleForm.GroupInfo.ID === this.value.GroupInfo.ID
       && this.ruleForm.Allow === this.value.Allow
       && this.ruleForm.AllowCustomer === this.value.AllowCustomer
       && this.ruleForm.IsCheckedCustomize === this.value.IsCheckedCustomize
       && this.ruleForm.IsCheckedCustomerCustomize === this.value.IsCheckedCustomerCustomize) {
        this.messageBox.failSingle('未发生更改，可选择关闭');
        return;
      }
      if (this.value && this.value.GroupInfo && this.ruleForm.GroupInfo.ID !== this.value.GroupInfo.ID) {
        const cb = () => {
          const t = this.canUseGroupData.find(it => it.ID === this.ruleForm.GroupInfo.ID);
          const GroupInfo = t || this.ruleForm.GroupInfo;
          const temp = { ...this.ruleForm, GroupInfo, SizeList: [] };
          this.$emit('change', temp);
        };
        this.messageBox.warnCancelBox('当前已设置尺寸组', '如果更改尺寸组，则所有固定尺寸将被清空，确定更改吗？', cb);
        // this.messageBox.warnCancelBox('当前已设置尺寸组', '已有固定尺寸，请先清除固定尺寸后才可更改尺寸组');
        return;
      }
      const t = this.canUseGroupData.find(it => it.ID === this.ruleForm.GroupInfo.ID);
      const GroupInfo = t || this.ruleForm.GroupInfo;
      const temp = { ...this.ruleForm, GroupInfo };
      this.$emit('change', temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ElementGroup = [];
      this.ruleForm = null;
    },
    initEditData() { // 数据初始化方法
      if (!this.value || !this.value.GroupInfo) {
        this.ruleForm = {
          Allow: false,
          AllowCustomer: false,
          IsCheckedCustomize: false,
          IsCheckedCustomerCustomize: false,
          GroupInfo: {
            ID: '',
          },
          SizeList: [],
        };
      } else {
        const { Allow, AllowCustomer, IsCheckedCustomize, IsCheckedCustomerCustomize, GroupInfo, SizeList } = this.value;
        this.ruleForm = {
          Allow,
          AllowCustomer,
          IsCheckedCustomize,
          IsCheckedCustomerCustomize,
          GroupInfo: {
            ID: GroupInfo.ID,
          },
          SizeList,
        };
      }
      this.getElementGroupData();
    },
    async getElementGroupData() {
      if (!this.PositionID) return;
      // if (!this.PositionID || this.ElementGroup.length > 0) return;
      this.loading = true;
      const resp = await this.api.getElementGroupList(this.PositionID).catch(() => {});
      this.loading = false;
      if (resp && resp.data && resp.data.Status === 1000) {
        this.ElementGroup = resp.data.Data;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-size-group-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    min-height: 220px;
    max-height: 420px;
    overflow-y: auto;
    padding-left: 30px;
    padding-right: 40px;
    p.empty-element-group {
      padding-top: 20px;
      display: flex;
      align-items: center;
      > i {
        margin-right: 8px;
        font-size: 28px;
      }
    }
    p.is-origin {
      display: flex;
      align-items: center;
      line-height: 24px;
      > i {
        font-size: 32px;
        margin-right: 12px;
        line-height: 26px;
      }
    }
    .el-radio-group {
      padding-left: 25px;
      min-height: 61px;
      padding-top: 10px;
      .el-radio {
        width: 130px;
        margin-right: 10px;
        margin-bottom: 14px;
        .el-radio__label {
          font-size: 12px;
          max-width: 106px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          display: inline-block;
          vertical-align: -1px;
        }
      }
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #f5f5f5;
      padding-left: 158px;
      padding-top: 18px;
      padding-right: 40px;
      > .el-checkbox {
        margin: 10px 55px 10px 0;
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
