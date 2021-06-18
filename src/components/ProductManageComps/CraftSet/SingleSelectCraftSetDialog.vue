<template>
  <CommonDialogComp
    width="800px"
    top='12vh'
    :title="title"
    :visible.sync="visible"
    :disabled='curCanSelectUsableCraftList.length < 2'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-single-craft-set-dialog-comp-wrap"
   >
    <el-checkbox-group v-model="ruleForm.List" v-if="ruleForm">
      <el-checkbox :label="it.ID" v-for="it in usableCraftList"
       :key="it.ID" :title="it.Name" :disabled='CraftConditionIDs.includes(it.ID)'>{{it.Name}}</el-checkbox>
    </el-checkbox-group>
    <div class="select-type" v-if="ruleForm">
      <el-checkbox :disabled='curCanSelectUsableCraftList.length < 2' v-model="ruleForm.IsRequired">必选</el-checkbox>
      <div>
        <template v-if="ruleForm && ruleForm.IsRequired">
          <span>初始选中：</span>
          <el-select  v-model="ruleForm.DefaultCraft" placeholder="请选择" size="mini">
            <el-option
              v-for="item in optionList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </template>
      </div>
    </div>
    <p class="tips-box" v-if="curCanSelectUsableCraftList.length < 2"> <i class="el-icon-warning"></i> 当前可选工艺数量少于2，不支持单选工艺设置</p>
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
    usableCraftList: {
      type: Array,
      default: null,
    },
    CraftConditionList: {
      type: Array,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      title: '',
      ruleForm: null,
    };
  },
  computed: {
    selectList() {
      if (!this.ruleForm.List || this.ruleForm.List.length === 0) return [];
      return this.ruleForm.List.map(it => this.usableCraftList.find(_it => _it.ID === it)).filter(it => it);
    },
    optionList() {
      const item = { ID: '', Name: '不选中' };
      if (!this.selectList || this.selectList.length === 0) return [item];
      const _list = this.selectList.filter(it => it && it.ElementList.length === 0);
      return [item, ..._list];
    },
    CraftConditionIDs() {
      if (!this.CraftConditionList || this.CraftConditionList.length === 0) return [];
      const _list = [];
      this.CraftConditionList.forEach(it => {
        if (!(this.ruleForm && this.ruleForm.ID === it.ID)) _list.push(...it.List);
      });
      return _list;
    },
    curCanSelectUsableCraftList() {
      if (!this.usableCraftList || this.usableCraftList.length === 0) return [];
      if (this.CraftConditionIDs.length === 0) return this.usableCraftList;
      return this.usableCraftList.filter(it => !this.CraftConditionIDs.includes(it.ID));
    },
  },
  methods: {
    onSubmit() {
      if (!this.ruleForm) return;
      if (this.ruleForm.List.length < 2) {
        this.messageBox.failSingleError('保存失败', '请选中且至少选中2个工艺');
        return;
      }
      if (this.ruleForm.IsRequired && this.ruleForm.DefaultCraft && !this.ruleForm.List.includes(this.ruleForm.DefaultCraft)) {
        this.messageBox.failSingleError('保存失败', '当前选中的初始选中工艺不在所选工艺列表中');
        return;
      }
      const temp = { ...this.ruleForm, DefaultCraft: this.ruleForm.IsRequired ? this.ruleForm.DefaultCraft : '' };
      this.$emit('change', temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
      this.title = '';
    },
    initEditData() { // 数据初始化方法
      if (this.value) {
        this.title = '编辑单选工艺';
        const { ID, IsRequired, DefaultCraft, List } = this.value;
        this.ruleForm = {
          ID,
          IsRequired,
          DefaultCraft,
          List: [...List],
        };
      } else {
        this.title = '添加单选工艺';
        this.ruleForm = {
          ID: '',
          IsRequired: false,
          DefaultCraft: '',
          List: [],
        };
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-single-craft-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 20px;
    min-height: 300px;
    max-height: 520px;
    .el-checkbox-group {
      padding-bottom: 35px;
      min-height: 160px;
      .el-checkbox {
        width: 135px;
        margin-right: 5px;
        margin-bottom: 12px;
      }
    }
    .el-checkbox__label {
      font-size: 12px;
      color: #585858;
      max-width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
    }
    .select-type {
      text-align: center;
      padding-right: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      .el-checkbox {
        height: 28px;
        line-height: 28px;
      }
      > div {
        width: 200px;
        display: flex;
        align-items: center;
        > span {
          font-size: 12px;
          margin-left: 30px;
        }
        .el-select {
          width: 110px;
        }
      }
    }
    .tips-box {
      margin-top: 20px;
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
