<template>
  <section class="mp-erp-period-manage-pay-time-manage-setup-page" v-if="payTimeForm">
    <header>
      <p class="mp-common-title-wrap">{{saveType}}最晚付款时间</p>
    </header>
    <main>
      <ul>
        <li class="f">
          <span class="title">指定区域：</span>
          <div>
            <span class="blue-span" @click="onAreaSelectClick">选择区域</span>
            <!-- 区域展示文字 -->
            <span class="remark" :title="payTimeForm.AreaDescribe">{{payTimeForm.AreaDescribe.replaceAll('\r\n', '、')}}</span>
          </div>
        </li>
        <li>
          <span class="title">配送方式：</span>
          <div class="content-item" v-if="subExpressList.length > 0">
            <p>
              <el-checkbox
                v-model="ExpressCheckAll"
                :indeterminate="isIndeterminate"
                >全选</el-checkbox
              >
            </p>
            <el-checkbox-group v-model="ExpressCheckList">
              <el-checkbox
                v-for="it in subExpressList"
                :key="it.ID"
                :label="it.ID"
                >{{ it.Name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </li>
        <li>
          <span class="title">付款时间：</span>
          <div class="content-item">
            <el-time-picker
              v-model="LatestPayTime"
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              :default-value='defaultBeginTime'
              placeholder="20:00"
              size="small"
            >
            </el-time-picker>
            <span class="r">之前</span>
          </div>
        </li>
        <li>
          <span class="title">生产延后时长：</span>
          <div class="content-item">
            <el-input maxlength="2" v-model="payTimeForm.ProduceDelayTime" size="small"></el-input>
            <span class="r">小时</span>
          </div>
        </li>
      </ul>
      <ADAreaDialogSelector :visible.sync="visible" v-model="payTimeForm.AreaList" :AreaDescribe.sync='payTimeForm.AreaDescribe' />
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import PayTimeItemClass from '@/store/Period/ItemClass/PayTimeItemClass';
import ADAreaDialogSelector from '@/components/common/SelectorComps/ADAreaDialogSelector/index.vue';

export default {
  name: 'PayTimeSetupPage',
  components: {
    ADAreaDialogSelector,
  },
  data() {
    return {
      payTimeForm: null,
      visible: false,
    };
  },
  computed: {
    // ...mapState('periodManage', ['curPayTimeEditData']),
    ...mapGetters('common', ['subExpressList']),
    ExpressCheckAll: {
      get() {
        return (
          this.payTimeForm.ExpressList.length > 0
          && this.payTimeForm.ExpressList.length === this.subExpressList.length
        );
      },
      set(val) {
        const _list = val ? this.subExpressList : [];
        this.payTimeForm.ExpressList = _list;
      },
    },
    ExpressCheckList: {
      get() {
        return this.payTimeForm.ExpressList.map((it) => it.ID);
      },
      set(val) {
        const _list = val.map((it) => ({ ID: it }));
        this.payTimeForm.ExpressList = _list;
      },
    },
    isIndeterminate() {
      if (
        this.payTimeForm.ExpressList.length === 0
        || this.subExpressList.length === this.payTimeForm.ExpressList.length
      ) { return false; }
      return (
        this.payTimeForm.ExpressList.length < this.subExpressList.length
      );
    },
    LatestPayTime: {
      get() {
        if (!this.payTimeForm) return '';
        const { First, Second } = this.payTimeForm.LatestPayTime;
        if ((!First && First !== 0) || (!Second && Second !== 0)) return '';
        const _f = `0${First}`.slice(-2);
        const _s = `0${Second}`.slice(-2);
        return `${_f}:${_s}`;
      },
      set(val) {
        if (!val) return;
        const [First, Second] = val.split(':');
        this.payTimeForm.LatestPayTime.First = First;
        this.payTimeForm.LatestPayTime.Second = Second;
      },
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0));
    },
    saveType() {
      if (this.payTimeForm && this.payTimeForm.ItemID) return '编辑';
      return '添加';
    },
  },
  methods: {
    async onSubmitClick() {
      if (PayTimeItemClass.submitChecker(this.payTimeForm)) {
        this.$store.dispatch('periodManage/getPayTimeItemSave', [this.payTimeForm, this.onGoBackClick]);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onAreaSelectClick() {
      this.visible = true;
    },
    filterEditDataExpressList() { // 去除已不在当前配送方式列表中的配送方式
      if (this.subExpressList && this.subExpressList.length > 0 && this.payTimeForm) {
        const validExpressIDs = this.subExpressList.map(it => it.ID);
        this.payTimeForm.ExpressList = this.payTimeForm.ExpressList.filter(it => validExpressIDs.includes(it.ID));
      }
    },
    async getInitItemData() { // 获取初始详情数据以还原使用
      let temp;
      const { ItemID } = this.$route.params;
      if (ItemID !== 'null') {
        const resp = await this.api.getPayTimeDetail(ItemID).catch(() => null);
        if (resp && resp.data.Status === 1000) temp = resp.data.Data;
      }
      this.payTimeForm = new PayTimeItemClass(temp);
      this.filterEditDataExpressList();
    },
  },
  watch: {
    subExpressList: {
      handler() { // 去除已不在当前有效配送方式列表中的配送方式项目
        this.filterEditDataExpressList();
      },
      immediate: true,
    },
  },
  created() {
    this.getInitItemData();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-pay-time-manage-setup-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  > header {
    flex: none;
    padding: 35px 45px;
    background-color: #fff;
    align-items: center;
  }
  > main {
    flex: 1;
    background-color: #fff;
    > ul {
      width: 850px;
      > li {
        display: flex;
        line-height: 30px;
        margin-bottom: 24px;
        color: #444;
        > span.title {
          font-size: 14px;
          font-weight: 700;
          width: 10em;
          text-align: right;
          flex: none;
          margin-right: 5px;
        }
        > div {
          font-size: 14px;
          .el-input {
            width: 140px;
            height: 30px;
            line-height: 30px;
            input {
              height: 30px;
              line-height: 30px;
              border-radius: 5px;
              border-color: #e5e5e5;
              position: relative;
              top: -2px;
            }
            .el-input__icon {
              line-height: 30px;
            }
          }
          .el-checkbox {
            line-height: 24px;
            .el-checkbox__label {
              font-size: 12px;
              color: #444;
            }
          }
          .el-checkbox-group {
            line-height: 20px;
            padding-bottom: 20px;
          }
          > .r {
            font-size: 14px;
            margin-left: 9px;
          }
        }
        &.f {
          margin-bottom: 18px;
          .remark {
            max-width: 560px;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 20px;
            font-size: 12px;
            display: inline-block;
            white-space: nowrap;
            vertical-align: top;
            color: #989898;
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 100px;
    padding-left: 306px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
    }
  }
}
</style>
