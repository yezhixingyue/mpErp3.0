<template>
  <CommonDialogComp
    width="800px"
    top='13vh'
    :title="title"
    :visible="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    submitText='确定'
    class="mp-erp-comps-price-module-price-table-item-option-data-set-dialog-comp-wrap"
  >
    <div class="form-item">
      <p>
        <span class="mp-common-title-wrap black">表数据</span>
      </p>
      <div class="unit">
        <span class="label">数据单位：</span>
        <el-input v-model.trim="Unit" size="small" maxlength="12" show-word-limit></el-input>
        <span class="tips-box"> <i class="el-icon-warning"></i> 注：可为空，仅作备注使用，无实际效用！</span>
      </div>
    </div>
    <div class="form-item">
      <p>
        <span class="mp-common-title-wrap black">其他数据</span>
        <span class="blue-span" @click="onAddClick" :class="{disabled: DataList.length>=2}">+ 添加一行</span>
      </p>
      <ul>
        <li class="title">
          <span>名称</span>
          <span>单位</span>
          <span class="ctrl">操作</span>
        </li>
        <li v-for="(item, i) in DataList" :key="item.ID">
          <el-input v-model.trim="item.Name" size="small" maxlength="6"></el-input>
          <el-input v-model.trim="item.Unit" size="small" maxlength="6"></el-input>
          <CtrlMenus class="ctrl" :showList="['del']" @remove='onRemoveClick(i)' />
        </li>
        <!-- <li v-show="DataList.length === 0" class="empty">未设置</li> -->
      </ul>
    </div>
    <div class="tips">
      <p>其他数据说明：</p>
      <p>每张表内部各数据的名称不能为空，不能重复，且名称不能叫“表数据”，公式以此名称来引用该数据</p>
      <p>单位可为空，仅作备注使用，无实际效用！</p>
      <p class="is-bold">最多添加 2 个其他数据！</p>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    saveData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    CtrlMenus,
  },
  computed: {
  },
  data() {
    return {
      title: '设置表数据',
      Unit: '',
      DataList: [],
    };
  },
  methods: {
    async onSubmit() { // 提交
      if (this.DataList.length > 0) {
        let i = this.DataList.findIndex(it => !it.Name);
        if (i > -1) {
          this.messageBox.failSingleError('保存失败', `第${i + 1}行其它数据未填写名称信息`);
          return;
        }
        i = this.DataList.findIndex(it => it.Name === '表数据');
        if (i > -1) {
          this.messageBox.failSingleError('保存失败', `第${i + 1}行其它数据中名称不能为表数据`);
          return;
        }
        const names = this.DataList.map(it => it.Name);
        const len = names.length;
        const filterLength = [...new Set(names)].length;
        if (len > filterLength) {
          this.messageBox.failSingleError('保存失败', '其它数据中存在重复名称，请检查并修改');
          return;
        }
      }
      const temp = {
        Unit: this.Unit,
        DataList: this.DataList,
      };
      this.$emit('submit', temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
    },
    initEditData() { // 数据初始化方法
      this.Unit = '';
      this.DataList = [];
      if (this.saveData) {
        const { Unit, DataList } = this.saveData;
        if (Unit) this.Unit = Unit;
        if (Array.isArray(DataList)) this.DataList = JSON.parse(JSON.stringify(DataList));
      }
    },
    onAddClick() {
      if (this.DataList.length >= 2) return;
      const ID = this.$utils.getAUUID();
      const temp = {
        ID,
        Name: '',
        Unit: '',
      };
      this.DataList.push(temp);
    },
    onRemoveClick(index) {
      this.DataList.splice(index, 1);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-price-module-price-table-item-option-data-set-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 50px;
    padding-bottom: 10px;
    padding-top: 30px;
    height: 425px;
    > div {
      &.form-item {
        > p {
          margin-bottom: 25px;
          > .blue-span {
            margin-left: 20px;
          }
        }
        > div {
          display: flex;
          align-items: center;
          margin-bottom: 45px;
          > .el-input {
            width: 140px;
            margin-left: 6px;
            margin-right: 22px;
          }
          > .tips-box {
            width: 350px;
          }
        }
        > ul {
          width: 500px;
          > li {
            display: flex;
            align-items: center;
            padding-left: 25px;
            margin-bottom: 15px;
            &.title {
              border-bottom: 1px solid #eee;
              line-height: 26px;
              color: #a2a2a2;
              padding-top: 10px;
              > span {
                width: 100px;
                text-align: center;
                margin-right: 20px;
                &.ctrl {
                  text-align: left;
                  margin-left: 92px;
                }
              }
            }
            > .el-input {
              width: 100px;
              margin-right: 20px;
              input {
                padding: 0 12px;
              }
            }
            .ctrl {
              margin-left: 85px;
            }
          }
        }
        .unit {
          .el-input {
            width: 220px;
          }
        }
      }
      &.tips {
        padding-top: 20px;
        > p {
          color: #999;
          padding: 6px 0;
          &:first-of-type {
            padding-bottom: 10px;
          }
        }
      }
    }
    .label {
      color: #888E99;
      font-size: 14px;
    }
    .el-input__inner {
      font-size: 12px;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
