<template>
  <CommonDialogComp
    width="800px"
    top='12vh'
    title="设置分组"
    :visible.sync="visible"
    :disabled='canSelectList.length > 0 && usableCraftList && usableCraftList.length > 0'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-craft-grouping-set-dialog-comp-wrap"
   >
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" :disabled='canSelectList.length===0'>全选</el-checkbox>
    <span class="tips-box">（ 需要所有工艺都设置入分组后，才可保存！）</span>
    <el-checkbox-group v-model="checkList" v-if="usableCraftList">
      <el-checkbox :label="it.ID" v-for="it in usableCraftList" :disabled='selectedIds.includes(it.ID)'
       :key="it.ID" :title="it.Name" >{{it.Name}}</el-checkbox>
    </el-checkbox-group>
    <p class="btn">
      <el-button class="border-blue-btn" size="small" @click="joinGroup" :disabled='checkList.length===0'>+ 加入分组</el-button>
    </p>
    <section class="table">
      <header>
        <span>名称</span><span>界面隐藏名称</span><span>包含工艺</span>
      </header>
      <main>
        <div v-for="(it, i) in submitList" :key="it.key || it.ID">
          <el-input v-model.trim="it.Name" maxlength="10" size="small"></el-input>
          <el-checkbox v-model="it.IsNameHidden">隐藏</el-checkbox>
          <span class="list-name" :title="getItemNames(it.List)">{{getItemNames(it.List)}}</span>
          <span class="del-btn" @click="onOptionItemRemove(i)"><i></i> 删除</span>
        </div>
      </main>
    </section>
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
      type: Array,
      default: null,
    },
    usableCraftList: {
      type: Array,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      checkList: [],
      submitList: [],
    };
  },
  computed: {
    isIndeterminate() {
      if (this.checkList.length === 0 || this.checkList.length === this.canSelectList.length) return false;
      return true;
    },
    checkAll: {
      get() {
        return this.checkList.length > 0 && this.checkList.length === this.canSelectList.length;
      },
      set(val) {
        if (val) this.checkList = this.canSelectList.map(it => it.ID);
        else this.checkList = [];
      },
    },
    selectedIds() {
      if (!this.submitList || !Array.isArray(this.submitList) || this.submitList.length === 0) return [];
      return this.submitList.reduce((total, cur) => [...total, ...cur.List], []);
    },
    canSelectList() {
      if (!this.usableCraftList || this.usableCraftList.lenght === 0) return [];
      if (this.selectedIds.length === 0) return this.usableCraftList;
      return this.usableCraftList.filter(it => !this.selectedIds.includes(it.ID));
    },
  },
  methods: {
    onSubmit() {
      if (this.canSelectList.length > 0 && this.usableCraftList && this.usableCraftList.length > 0) return;
      const t = this.submitList.find(it => !it.Name);
      if (t) {
        this.messageBox.failSingleError('保存失败', '分组名称必填，请检查');
        return;
      }
      const i = this.submitList.findIndex(it => !this.$utils.checkName(it.Name));
      if (i > -1) {
        this.messageBox.failSingleError('保存失败', `第${i + 1}行分组名称输入不符合规范，请检查`);
        return;
      }
      const _nameList = this.submitList.map(it => it.Name);
      const _nameSetList = [...new Set(_nameList)];
      if (_nameList.length > _nameSetList.length) {
        this.messageBox.failSingleError('保存失败', '存在重复分组名称，请检查');
        return;
      }
      this.$emit('change', this.submitList);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.checkList = [];
      this.submitList = [];
    },
    initEditData() { // 数据初始化方法
      this.submitList = JSON.parse(JSON.stringify(this.value));
    },
    joinGroup() {
      if (this.checkList.length === 0) return;
      const temp = {
        IsNameHidden: false,
        List: this.checkList,
        ID: '',
        Name: '',
        key: Math.random().toString(36).slice(-8),
      };
      this.submitList.push(temp);
      this.checkList = [];
    },
    getItemNames(list) {
      if (!list || list.length === 0) return '';
      return list.map(it => {
        const t = this.usableCraftList.find(_it => _it.ID === it);
        return t ? t.Name : '';
      }).filter(it => it).join('、');
    },
    onOptionItemRemove(i) {
      this.submitList.splice(i, 1);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-craft-grouping-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 48px;
    min-height: 400px;
    max-height: 520px;
    overflow-y: auto;
    .el-checkbox-group {
      padding-bottom: 35px;
      min-height: 94px;
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
    > .el-checkbox {
      width: 40px;
      margin-bottom: 10px;
    }
    > .btn > span {
      margin-left: 10px;
    }
    > .table {
      padding-top: 24px;
      > header {
        color: #A2A2A2;
        font-size: 14px;
        border-bottom: 1px solid #eee;
        padding: 4px 0;
        line-height: 16px;
        display: flex;
        > span {
          text-align: center;
          &:first-of-type {
            width: 190px;
          }
          &:nth-of-type(2) {
            width: 90px;
          }
          &:last-of-type {
            width: 290px;
          }
        }
      }
      > main {
        padding-top: 3px;
        > div {
          display: flex;
          padding: 12px 22px 0;
          align-items: center;
          > .el-input {
            width: 150px;
          }
          > .el-checkbox {
            margin: 0;
            width: 120px;
            text-align: center;
            .el-checkbox__label {
              line-height: 13px;
            }
          }
          > span {
            line-height: 16px;
            &.list-name {
              width: 266px;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #999;
              white-space: nowrap;
              font-size: 12px;
              text-align: center;
            }
            &.del-btn {
              font-size: 12px;
              user-select: none;
              margin-left: 50px;
              line-height: 28px;
              > i {
                display: inline-block;
                width: 12px;
                height: 28px;
                vertical-align: top;
                margin-right: 5px;
                background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              }
              cursor: pointer;
              transition: color 0.05s ease-in-out;
              &:hover {
                color: #444 !important;
              }
            }
          }
        }
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
