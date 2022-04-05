<template>
  <CommonDialogComp
    width="750px"
    top="16vh"
    title="关联快递打单"
    :visible.sync="localVisible"
    smallBtn
    @submit="submitForm"
    @cancle="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-logistic-item-relation-link-dialog-comp-wrap"
  >
    <!-- 内容区 -->
    <ul v-if="ruleForm" class="content">
      <li v-for="(it, i) in ruleForm.RelationList" :key="it.key">
        <label>平台类型：</label>
        <el-select v-model="it.OutPlatType" placeholder="平台类型" size="small" class="line">
          <el-option
            v-for="item in OutPlatTypeEnumList"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
        <label>关联快递打单：</label>
        <el-select v-model="it.ThirdID" placeholder="快递打单" size="small" class="line express">
          <el-option
            v-for="item in ThirdPlatExpressList"
            :key="item.First"
            :label="item.Second"
            :value="item.First">
          </el-option>
        </el-select>
        <CtrlMenus
         :showList="['add', 'del']"
         :canAdd="ruleForm.RelationList.length < OutPlatTypeEnumList.length"
         :canRemove="ruleForm.RelationList.length > 1"
         @add="addOneRelationItem"
         @remove="onRemoveClick(i)"
         addText='添加'
         />
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CtrlMenus from '../common/NewComps/CtrlMenus/index.vue';
import LogisticItem from '../../assets/js/TypeClass/LogisticTypeClass/LogisticItem';
import { OutPlatTypeEnumList } from '../../assets/js/TypeClass/LogisticTypeClass/logisticEnums';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editData: {
      type: Object,
      default: null,
    },
    ThirdPlatExpressList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    CtrlMenus,
  },
  data() {
    return {
      ruleForm: null,
      OutPlatTypeEnumList,
    };
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
  methods: {
    onOpen() {
      this.$store.dispatch('basicSet/getThirdPlatExpressList');
      this.ruleForm = new LogisticItem(this.editData);
      if (this.ruleForm.RelationList.length === 0) {
        this.addOneRelationItem();
      }
    },
    onClosed() {
      this.ruleForm = null;
    },
    addOneRelationItem() {
      if (this.ruleForm.RelationList.length >= this.OutPlatTypeEnumList.length) return;
      const temp = {
        ThirdID: '',
        OutPlatType: '',
        key: Math.random().toString(16).slice(-10),
      };
      this.ruleForm.RelationList.push(temp);
    },
    onRemoveClick(i) {
      if (this.ruleForm.RelationList.length <= 1) return;
      this.ruleForm.RelationList.splice(i, 1);
    },
    checker() {
      const t = this.ruleForm.RelationList.find(it => !it.ThirdID || (!it.OutPlatType && it.OutPlatType !== 0));
      if (t) {
        this.messageBox.failSingleError('保存失败', '信息不完整');
        return false;
      }
      const _OutPlatTypeList = this.ruleForm.RelationList.map(it => it.OutPlatType);
      const len1 = _OutPlatTypeList.length;
      const len2 = [...new Set(_OutPlatTypeList)].length;
      if (len1 > len2) {
        this.messageBox.failSingleError('保存失败', '平台类型不能重复');
        return false;
      }
      return true;
    },
    submitForm() {
      if (this.checker()) {
        this.$emit('submit', this.ruleForm);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-logistic-item-relation-link-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 48px;
    padding-top: 40px;
    padding-left:70px;
    min-height: 280px;
    max-height: 420px;
    overflow: overlay;
    ul.content {
      > li {
        margin-bottom: 13px;
        > label {
          color: #888e99;
          font-size: 13px;
        }
        > .el-select {
          height: 30px;
          line-height: 30px;
          width: 110px;
          position: relative;
          top: -1px;
          margin-right: 28px;
          .el-input__inner {
            height: 30px;
            font-size: 13px;
            padding-left: 10px;
            padding-right: 24px;
          }
          .el-input__suffix {
            top: 2px;
            right: 0;
          }
          &.express {
            width: 160px;
          }
        }
        .tips-box {
          margin-bottom: 20px;
        }
        > .ctrl-menus-container {
          margin-left: 12px;
        }
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
    button {
      width: 120px;
      height: 30px;
      padding: 0;
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
