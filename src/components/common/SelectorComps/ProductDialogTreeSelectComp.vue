<template>
  <section class="mp-common-comps-area-checkout-dia-comp-wrap">
    <span class="span-title-blue" @click="handleDialogOpen">选择产品</span>
    <el-tooltip placement="top-start" :enterable='false'
      transition='none' v-if="textList && textList.length > 0">
      <div slot="content">
        <p v-for="(item, i) in textList" :key="item + '-' + i">
          {{ item }}
        </p>
      </div>
      <p>{{textList.join('、')}}</p>
    </el-tooltip>
    <p v-else>请选择产品</p>
    <el-dialog
      title="选择产品"
      :visible.sync="showDialog"
      :modal='false'
      width="750px"
      top='8vh'
      v-dialogDrag
      class="mp-img-style-header area-dialog-wrap"
      :before-close="handleDialogClose">
      <section>
        <tree-comp
          title=""
          v-if="showDialog"
          :treeList='allProductClassify'
          :defaultCheckedKeys='defaultCheckedKeys'
          :handleChangeFunc='handleSelectChangeFunc'
          checkAllTitle='所有产品'
          ref="TreeComp"
          />
      </section>
      <div slot="footer" class="dialog-footer">
        <normalBtnFull @click.native="handleDialogSave" title='确定' />
        <normalBtn @click.native="handleDialogClose" title="取消" />
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import TreeComp from '@/components/common/TreeComp.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import { getProductArrayList, reg } from '../../Promote/promoteUtils';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => ([]),
    },
  },
  components: {
    normalBtnFull,
    TreeComp,
    normalBtn,
  },
  data() {
    return {
      showDialog: false,
      SelectedProductArray: [],
    };
  },
  computed: {
    ...mapGetters('common', ['allProductClassify']),
    // ...mapState('common', ['areaList']),
    defaultCheckedKeys() {
      return this.SelectedProductArray.map(it => it.ProductID);
    },
    // Level2AreaList() {
    //   if (this.areaList.length === 0) return [];
    //   return this.areaList.filter(it => it.Level === 2);
    // },
    textList() {
      if (this.allProductClassify.length === 0 || !this.value) return [];
      const temp = getProductArrayList(this.value, this.allProductClassify);
      const _textArr = [];
      if (temp === '全部产品') return ['全部产品'];
      temp.forEach(l1 => {
        if (reg.test(l1.children[0])) {
          _textArr.push(`${l1.ClassName}全部产品`);
        } else {
          // _textArr.push(`${l1.ClassName}：`);
          let _text = `${l1.ClassName}：[`;
          l1.children.forEach((l2, i2) => {
            if (i2 > 0) _text += '、';
            if (reg.test(l2.children[0])) {
              _text += `全部${l2.ClassName}产品 `;
            } else {
              _text += `${l2.ClassName}: `;
              l2.children.forEach((l3, i) => {
                if (i === 0) _text += `${l3.ClassName}`;
                else _text += `、${l3.ClassName}`;
              });
            }
          });
          _text += ' ]';
          _textArr.push(_text);
        }
      });
      return _textArr;
    },
  },
  methods: {
    handleDialogOpen() {
      if (this.value) this.SelectedProductArray = this.value;
      this.showDialog = true;
    },
    handleDialogClose() {
      this.showDialog = false;
      this.$refs.TreeComp.clearTreeData();
      if (this.value) this.SelectedProductArray = this.value;
    },
    handleSelectChangeFunc(checkedNodes) {
      const _list = checkedNodes.filter(it => it.ProductID).map(it => {
        const FirstLevelID = it.ProductClass.First; // 1级分类ID
        const SecondLevelID = it.ProductClass.Second; // 2级分类ID
        const { ProductID, ProductName } = it;
        return ({ FirstLevelID, SecondLevelID, ProductID, ProductName });
      });
      this.SelectedProductArray = _list;
    },
    handleDialogSave() {
      if (!this.showDialog) return;
      this.$emit('change', this.SelectedProductArray);
      this.handleDialogClose();
    },
  },
  watch: {
    textList: {
      handler(newVal) {
        this.$store.commit('statistic/setCurSelectedProductShowText', newVal);
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.dispatch('common/getProductList');
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>
<style lang='scss'>
.mp-common-comps-area-checkout-dia-comp-wrap {
  .area-dialog-wrap {
    .el-dialog__header {
      > span::before {
        background: url(../../../assets/images/add.png) no-repeat center;
      }
      border-radius: 2px 2px 0px 0
    }
    .el-dialog__body {
      min-height: 520px;
      height: 50vh;
      overflow: auto;
    }
    .el-dialog__footer {
      > .dialog-footer {
        width: 100%;
        display: flex;
        justify-content: center;
        > button {
          margin: 0;
          & + button {
            margin-left: 35px;
          }
          &.normal-full-btn {
            line-height: 24px;
          }
        }
      }
    }
  }
  > p {
    line-height: 28px;
    font-size: 12px;
    color: #888E99;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 600px;
    height: 28px;
  }
}
</style>
