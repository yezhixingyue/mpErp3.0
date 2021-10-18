<template>
  <section
    class="mp-erp-timelimit-page-craft-period-item-set-page-wrap"
    v-if="!loading"
  >
    <header>
      <p class="mp-common-title-wrap">单个工艺工期设置</p>
      <section class="item">
        <div>
          <span class="title" style="line-height:16px">工艺选择：</span>
          <el-radio-group v-model="curCraftID">
            <el-radio
              v-for="it in CraftPeriodCraftListData"
              :key="it.ID"
              :label="it.ID"
              >{{ it.Name }}</el-radio
            >
          </el-radio-group>
        </div>
        <p class="tips-box is-pink"><i class="el-icon-warning"></i>注：切换工艺会清空下方已设置的其它条件</p>
      </section>
    </header>
    <ContionCommonComp
      ref="oLeftComp"
      :PropertyList="PropertyList"
      :ComparePropertyList="PropertyList"
      :showPriority="false"
      leftWidth="40%"
      leftText="其它条件："
      :curEditData="curEditData"
      rightTitle="则"
    >
      <section class="right-area item">
        <div>
          <span class="title">工期：</span>
          <div class="right-content-item">
            <el-input v-model="DurationDay"></el-input><span>天</span>
            <el-input :max="24" v-model="DurationHour"></el-input
            ><span>小时</span>
          </div>
        </div>
      </section>
    </ContionCommonComp>
    <!-- 指定区域选择 -->
    <footer>
      <el-button @click="onSubmitClick" type="primary">确定</el-button>
      <el-button @click="onGoBackClick"
        ><i class="el-icon-d-arrow-left"></i> 返回</el-button
      >
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import CraftPeriodClass from '@/store/timeLimit/CraftPeriodClass';

export default {
  name: 'SingleCraftPeriodItemSetPage',
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('timelimit', [
      'TimeLimitData',
      'CraftPeriodItemData',
      'CraftPeriodCraftListData',
    ]),
    curEditData() {
      return this.CraftPeriodItemData;
    },
    curCraftID: {
      get() {
        if (this.CraftPeriodItemData.CraftList.length > 0) return this.CraftPeriodItemData.CraftList[0].ID;
        return '';
      },
      set(val) {
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'Constraint',
          { FilterType: 1, ItemList: [] },
        ]);
        this.$refs.oLeftComp.clearAllItemContent();
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'CraftList',
          [{ ID: val }],
        ]);
        this.getCraftPeriodProppertyList(val);
      },
    },
    DurationDay: {
      get() {
        if (!this.CraftPeriodItemData) return '';
        return this.CraftPeriodItemData.DurationDay;
      },
      set(val) {
        const _val = val.replace(/[^\d]/g, '');
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'DurationDay',
          _val,
        ]);
        const _DuraHour = this.CraftPeriodItemData.Duration
          ? Math.floor(this.CraftPeriodItemData.Duration % 24)
          : 0;
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'Duration',
          +_DuraHour + +_val * 24,
        ]);
      },
    },
    DurationHour: {
      get() {
        if (!this.CraftPeriodItemData) return '';
        return this.CraftPeriodItemData.DurationHour;
      },
      set(newValue) {
        let _val = newValue.replace(/[^\d]/g, '');
        if (_val >= 24) _val = 23;
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'DurationHour',
          _val,
        ]);
        const _DurationDay = this.CraftPeriodItemData.Duration
          ? Math.floor(this.CraftPeriodItemData.Duration / 24)
          : 0;
        this.$store.commit('timelimit/setCraftPeriodItemData', [
          'Duration',
          +_DurationDay * 24 + +_val,
        ]);
      },
    },
  },
  data() {
    return {
      loading: true,
      PropertyList: [],
    };
  },
  methods: {
    async getCraftPeriodProppertyList(CraftID) {
      this.PropertyList = [];
      const temp = { UseModule: 42, CraftID };
      const list = await PropertyClass.getPropertyList(temp);
      if (list) {
        this.PropertyList = list;
      }
    },
    onSubmitClick() {
      const key = CraftPeriodClass.check(this.CraftPeriodItemData);
      if (key === true) {
        const condition = this.$refs.oLeftComp.getConditonResult();
        if (!condition) return;
        this.$store.commit('timelimit/setCraftPeriodItemData', ['Constraint', condition.Constraint]);
        let _list = [];
        if (this.$route.params.EditIndex !== 'new') {
          _list = [...this.TimeLimitData.CraftPeriodList];
          _list.splice(this.$route.params.EditIndex, 1, { ...this.CraftPeriodItemData });
        } else {
          _list = [{ ...this.CraftPeriodItemData }, ...this.TimeLimitData.CraftPeriodList];
        }
        this.$store.commit('timelimit/setTimeLimitData', ['CraftPeriodList', _list]);
        this.onGoBackClick();
      } else if (typeof key === 'string') {
        this.messageBox.failSingleError('保存失败', `[ ${key} ]`);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
  },
  async mounted() {
    if (this.curCraftID) {
      if (Array.isArray(this.CraftPeriodItemData?.CraftPeriodProppertyList) && this.CraftPeriodItemData.CraftPeriodProppertyList.length > 0) {
        this.PropertyList = this.CraftPeriodItemData.CraftPeriodProppertyList;
      } else {
        await this.getCraftPeriodProppertyList(this.curCraftID);
      }
    }
    this.loading = false;
  },
};
</script>
<style lang='scss'>
.mp-erp-timelimit-page-craft-period-item-set-page-wrap {
  height: 100%;
  padding-top: 30px;
  box-sizing: border-box;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  > header {
    > p {
      padding-bottom: 30px;
    }
    padding-bottom: 25px;
    section.item > div > div {
      min-height: 38px !important;
    }
  }
  section.item > div {
    display: flex;
    color: #444;
    margin-bottom: 5px;
    align-items: flex-start;
    > .title {
      flex: 0 0 auto;
      font-weight: 700;
      font-size: 14px;
      width: 85px;
      text-align: right;
      margin-right: 6px;
      line-height: 30px;
      user-select: none;
      > i {
        color: #989898;
        font-weight: 400;
        font-size: 13px;
      }
    }
    > div {
      > label {
        margin-right: 8px;
        margin-bottom: 15px;
        > span {
          font-size: 12px;
          &.el-radio__label {
            min-width: 84px;
            display: inline-block;
            padding-left: 8px;
          }
        }
      }
      &.right-content-item {
        white-space: nowrap;
        .el-input {
          width: 80px;
          margin-right: 10px;
          > input {
            height: 30px;
            line-height: 30px;
            border-radius: 5px;
            text-align: center;
          }
        }
        .el-radio {
          .el-radio__label {
            font-size: 12px;
            color: #444;
          }
        }
      }
      &.right-content-item-check-box-wrap {
        margin-top: -3px;
        > p {
          line-height: 15px;
          margin-bottom: 15px;
        }
        .el-checkbox__label {
          font-size: 12px;
        }
        > div {
          > label {
            margin-right: 8px;
            margin-bottom: 15px;
            > span {
              font-size: 12px;
              &.el-checkbox__label {
                min-width: 84px;
                display: inline-block;
                padding-left: 8px;
              }
            }
          }
        }
      }
    }
    &:first-of-type > div {
      min-height: 60px;
    }
    &:last-of-type {
      // align-items: center;
      font-size: 13px;
      > .right-content-item {
        > span {
          color: #989898;
          &:first-of-type {
            margin-right: 30px;
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    padding: 25px 0 30px 0;
    text-align: center;
    > button.el-button {
      padding: 0;
      width: 120px;
      height: 35px;
      & + button.el-button {
        margin-left: 30px;
      }
    }
  }
  .mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
    > .left.mp-scroll-wrap {
      display: flex;
      flex-direction: column;
    }
    > .right {
      > .right-content {
        padding-left: 30px;
        padding-top: 18px;
        > header {
          display: none;
        }
      }
    }
  }
}
</style>
