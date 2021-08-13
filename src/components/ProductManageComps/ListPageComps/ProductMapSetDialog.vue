<template>
  <CommonDialogComp
    width="650px"
    top='15vh'
    title="设置元素"
    :visible.sync="visible"
    :loading="loading"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    v-if="itemData"
    class="mp-erp-comps-pruduct-module-product-element-map-set-dialog-comp-wrap"
  >
    <ul v-if="!loading" class="list">
      <li v-for="it in List" :key="it.First" class="item">
        <span class="label">{{it.label}}：</span>
        <el-select v-model="it.Second" placeholder="请选择" size="small">
          <el-option
            v-for="item in ElementData.List"
            :key="item.ID"
            :disabled='selectedElementIDs.includes(item.ID) && it.Second !== item.ID'
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import { mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('productManage', ['ProductElementTypeList']),
    selectedElementIDs() {
      return this.List.map(it => it.Second).filter(it => it);
    },
  },
  data() {
    return {
      PartID: '',
      ElementData: { // 下拉列表数据
        PositionID: '',
        List: [],
      },
      loading: false,
      List: [], // 要保存的数据列表
    };
  },
  methods: {
    onSubmit() {
      const temp = {
        ProductID: this.itemData.ID,
        PartID: this.PartID,
        List: this.List,
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
      this.PartID = '';
      this.List = [];
    },
    initEditData() { // 数据初始化方法
      if (this.curData) this.PartID = this.curData.ID; // 部件ID，

      // 获取下拉列表数据
      const PostionID = this.PartID || this.itemData.ID;
      if (this.ElementData.PositionID !== PostionID) {
        this.ElementData.PositionID = PostionID;
        this.getElementList();
      }
      // 设置元素对应列表数据
      this.List = this.ProductElementTypeList.map(it => {
        const TypeList = this.curData ? this.curData.TypeList : this.itemData.TypeList;
        let Second = '';
        const t = TypeList.find(_it => _it.First === it.ID);
        if (t) Second = t.Second;
        return {
          Second,
          First: it.ID,
          label: it.Name,
        };
      });
    },
    async getElementList() {
      this.loading = true;
      const resp = await this.api.getElementList({ positionID: this.ElementData.PositionID }, true).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.ElementData.List = resp.data.Data.filter(it => it.Type === 1 && !it.Group);
      }
      this.loading = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-product-element-map-set-dialog-comp-wrap {

  .el-dialog__body {
    min-height: 100px;
    padding-left: 15px;
    padding-top: 40px;
    > ul.list {
      display: flex;
      flex-wrap: wrap;
      > li.item {
        margin-bottom: 18px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        > span {
          margin-right: 6px;
          color: #888E99;
          font-size: 14px;
          width: 120px;
          text-align: right;
          line-height: 20px;
        }
        .el-select {
          width: 140px;
        }
      }
    }
  }
}
</style>
