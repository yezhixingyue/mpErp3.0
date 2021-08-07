<template>
  <CommonDialogComp
    width="800px"
    top='12vh'
    title="选择物料"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-factory-set-material-select-dialog-comp-wrap"
   >
    <div v-for="(lv1, index1) in optionList" :key="lv1.Name + '' + index1" class="lv1-item">
      <span class="mp-common-title-wrap" :title="lv1.Name">{{lv1.Name}}</span>
      <ul>
        <li v-for="(lv2, index2) in lv1.List" :key="lv2.Name + '' + index2">
          <el-checkbox
           :indeterminate="getIndeterminate(lv2)"
           :value='getLv2Value(lv2)'
           @change="bool => handleLv2Change(bool, lv2)"
           :title="lv2.Name"
           >{{lv2.Name}}</el-checkbox>
          <el-checkbox-group v-model="checkList">
            <el-checkbox :title="lv3.Name" :label="lv3.Data.First" v-for="(lv3, index3) in lv2.List" :key="lv3.Name + '' + index3">{{lv3.Name}}</el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
    </div>
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
    optionList: {
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
    };
  },
  computed: {
  },
  methods: {
    onSubmit() {
      if (this.checkList.filter(it => it).length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择物料');
        return;
      }
      this.$emit('change', this.checkList);
      this.onCancle();
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.checkList = [];
    },
    initEditData() { // 数据初始化方法
      if (Array.isArray(this.value)) {
        this.checkList = JSON.parse(JSON.stringify(this.value));
      }
    },
    getLv2Value(lv2) {
      if (lv2.List.length === 0 && lv2.Data) return this.checkList.includes(lv2.Data.First);
      const t = lv2.List.find(it => !this.checkList.includes(it.Data.First));
      if (t) return false;
      return true;
    },
    handleLv2Change(bool, lv2) {
      const ids = lv2.Data ? [lv2.Data.First] : lv2.List.map(it => it.Data.First);
      this.checkList = this.checkList.filter(it => !ids.includes(it));
      if (bool) this.checkList.push(...ids);
    },
    getIndeterminate(lv2) {
      const ids = lv2.Data ? [lv2.Data.First] : lv2.List.map(it => it.Data.First);
      const list = ids.filter(it => this.checkList.includes(it));
      return list.length > 0 && list.length < ids.length;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-factory-set-material-select-dialog-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow-y: auto;
    div.lv1-item {
      display: flex;
      margin-bottom: 20px;
      > span {
        width: 120px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 700;
        color: #444;
        flex: none;
        font-size: 15px;
        &::before {
          height: 16px;
        }
      }
      > ul {
        > li {
          display: flex;
          margin-bottom: 10px;
          > label {
            width: 130px;
            margin-right: 10px;
            font-weight: 700;
            color: #444;
            flex: none;
            .el-checkbox__label {
              width: 110px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: -5px;
            }
          }
          > div.el-checkbox-group {
            white-space: normal;
            .el-checkbox {
              margin-right: 10px;
              height: 28px;
              .el-checkbox__label {
                font-size: 12px;
                color: #585858;
                width: 122px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
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
