<template>
  <section class="mp-common-comps-area-checkout-dia-comp-wrap">
    <span class="span-title-blue" @click="handleAreaDialogOpen">选择区域</span>
    <el-tooltip placement="top-start" :enterable='false'
      transition='none' v-if="areaShowTextArr && areaShowTextArr.length > 0">
      <div slot="content">
        <p v-for="(item, i) in areaShowTextArr" :key="item + '-' + i">
          {{ item }}
        </p>
      </div>
      <p>{{areaShowTextArr.join('、')}}</p>
    </el-tooltip>
    <p v-else>请选择区域</p>
    <el-dialog
      title="选择区域"
      :visible.sync="showDialog"
      :modal='false'
      width="750px"
      top='8vh'
      v-dialogDrag
      class="mp-img-style-header area-dialog-wrap"
      :before-close="handleAreaDialogClose">
      <section>
        <tree-comp
          title=""
          v-if="showDialog"
          :treeList='allAreaTreeList'
          :defaultCheckedKeys='defaultCheckedKeys'
          :handleChangeFunc='handleAreaChangeFunc'
          checkAllTitle='所有地区'
          ref="TreeComp"
          />
      </section>
      <div slot="footer" class="dialog-footer">
        <normalBtnFull @click.native="handleAreaDialogSave" title='确定' />
        <normalBtn @click.native="handleAreaDialogClose" title="取消" />
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import TreeComp from '@/components/common/TreeComp.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import { getAreaList, reg } from '../../Promote/promoteUtils';

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
      SellAreaArray: [],
    };
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList']),
    ...mapState('common', ['areaList']),
    defaultCheckedKeys() {
      return this.SellAreaArray.map(it => it.CountyID);
    },
    Level2AreaList() {
      if (this.areaList.length === 0) return [];
      return this.areaList.filter(it => it.Level === 2);
    },
    areaShowTextArr() {
      if (this.allAreaTreeList.length === 0 || !this.value) return [];
      const type = 'ClassName';
      const temp = getAreaList(this.value, this.allAreaTreeList, type);
      const _textArr = [];
      if (temp === '全部区域') return ['全部区域'];
      temp.forEach(l1 => {
        if (reg.test(l1.children[0])) {
          _textArr.push(`${l1[type]}`);
        } else {
          let _text = `${l1[type]}：[`;
          l1.children.forEach((l2, i2) => {
            if (i2 > 0) _text += '、';
            if (reg.test(l2.children[0])) {
              _text += `${l2[type]}全部区域 `;
            } else {
              _text += `${l2[type]}: `;
              l2.children.forEach((l3, i) => {
                if (i === 0) _text += `${l3[type]}`;
                else _text += `、${l3[type]}`;
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
    handleAreaDialogOpen() {
      if (this.value) this.SellAreaArray = this.value;
      this.showDialog = true;
    },
    handleAreaDialogClose() {
      this.showDialog = false;
      this.$refs.TreeComp.clearTreeData();
      if (this.value) this.SellAreaArray = this.value;
    },
    handleAreaChangeFunc(checkedNodes) {
      const _level2List = checkedNodes.filter(it => it.Level === 2);
      const _list = checkedNodes.filter(it => it.Level === 3).map(it => {
        const CityID = it.ParentID;
        let _t = _level2List.find(it2 => it2.ID === CityID);
        if (!_t) {
          _t = this.Level2AreaList.find(it4 => it4.ID === CityID);
        }
        const RegionalID = _t ? _t.ParentID : '';
        return ({ CountyID: it.ID, CityID, RegionalID });
      });
      this.SellAreaArray = _list;
    },
    handleAreaDialogSave() {
      // console.log('handleAreaDialogSave', this.SellAreaArray);
      if (!this.showDialog) return;
      this.$emit('change', this.SellAreaArray);
      this.handleAreaDialogClose();
    },
  },
  watch: {
    areaShowTextArr: {
      handler(newVal) {
        this.$store.commit('statistic/setCurSelectedAreaShowText', newVal);
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.dispatch('common/getAreaList');
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
}
</style>
