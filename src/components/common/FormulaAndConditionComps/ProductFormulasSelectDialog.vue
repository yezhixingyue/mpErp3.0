<template>
  <CommonDialogComp
    width="700px"
    top='15vh'
    :title="title"
    :visible.sync="visible"
    :showSubmit='false'
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-common-comps-product-formula-select-dialog-comp-wrap"
  >
    <template v-if="!productData">
      <p class="tips-box is-pink"> <i class="el-icon-warning"></i> 未获取到产品信息，请刷新重试</p>
    </template>
    <!-- <template v-else-if="!list || list.length === 0">
      <p class="tips-box is-pink"> <i class="el-icon-warning"></i> 暂无公式</p>
    </template> -->
    <template v-else>
      <ul class="list mp-scroll-wrap">
        <li v-for="it in localRadioList" :key='it.ID'>
          <p class="mp-common-title-wrap">{{it.PartName}}</p>
          <div>
            <span :class="{disabled: selectedIDs.includes(item.ID)}" @click="onClick(item)"
             class="blue-span" v-for="item in it.List" :key="item.ID">{{item.Name}}</span>
          </div>
        </li>
        <li>
          <p class="mp-common-title-wrap">常数</p>
          <div>
            <span class="blue-span" @click="onClick(null)">常数</span>
          </div>
        </li>
      </ul>
    </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    selectedIDs: {
      type: Array,
      default: () => [],
    },
    productData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localRadioList() {
      if (!this.productData || !Array.isArray(this.list) || this.list.length === 0) return [];
      const _list = [];
      this.list.forEach(it => {
        if (!it.GroupID) {
          if (!it.PartID) { // 产品上
            const t = _list.find(_it => _it.PartName === '产品');
            if (t) t.List.push(it);
            else _list.push({ PartName: '产品', List: [it], ID: 'product' });
          } else { // 部件上
            const t = _list.find(_it => _it.ID === it.PartID);
            if (t) t.List.push(it);
            else {
              const targetPart = this.productData.PartList.find(_it => _it.ID === it.PartID);
              const PartName = targetPart ? targetPart.Name : '未知部件';
              _list.push({ PartName, List: [it], ID: it.PartID });
            }
          }
        }
      });
      return _list;
    },
  },
  data() {
    return {
      title: '设置尺寸数量',
      radio: '',
    };
  },
  methods: {
    onClick(item) {
      this.$emit('select', item);
      this.onCancle();
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
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-product-formula-select-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 60px;
    padding-bottom: 10px;
    padding-top: 30px;
    min-height: 135px;
    .list {
      min-height: 220px;
      max-height: 450px;
      overflow-y: auto;
      > li {
        > p {
          padding-bottom: 15px;
        }
        > div {
          line-height: 24px;
          padding-left: 30px;
          > span {
            margin-right: 20px;
            display: inline-block;
            min-width: 8em;
          }
        }
        & + li {
          margin-top: 30px;
        }
      }
    }
  }

}
</style>
