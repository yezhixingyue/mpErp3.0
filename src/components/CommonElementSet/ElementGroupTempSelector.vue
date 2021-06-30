<template>
  <CommonDialogComp
    width="800px"
    top='20vh'
    title="根据元素组模板添加"
    :visible.sync="visible"
    :disabled='!radio'
    cancelText='关闭'
    @cancle="onCancle"
    @submit="onSubmit"
    @open='onOpen'
    class="mp-erp-comps-element-template-element-group-select-comp-wrap"
  >
     <el-radio-group v-model="radio">
      <el-radio :label="it.ID" v-for="it in list" :key="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
    <p v-if="list && list.length === 0" style="font-size:12px;color:#888E99">暂无模板数据，可到元素模板页面中添加常用元素组模板</p>
    <p class="tips-box"><i class="el-icon-warning"></i> 注：根据元素组模板添加时，会自动添加元素组模板中包含的元素，如有重名请先修改重名元素名称，再选择添加。</p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  components: {
    CommonDialogComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      radio: '',
    };
  },
  methods: {
    onSubmit() {
      // console.log(this.radio, this.api.getElementGroupCopy);
      this.$emit('submit', this.radio);
      // this.onCancle();
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
    onOpen() {
      this.radio = '';
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-element-template-element-group-select-comp-wrap {
  .el-dialog__body {
    padding: 36px 28px 15px;
    max-height: 360px;
    overflow-y: auto;
    .el-radio {
      // display: inline-block;
      width: 143px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #585858;
      margin-right: 5px;
      line-height: 34px;
      .el-radio__label {
        font-size: 12px;
      }
    }
    .tips-box {
      margin-top: 60px;
      width: 720px;
    }
  }
}

</style>
