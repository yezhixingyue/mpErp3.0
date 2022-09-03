<template>
  <section class="mp-erp-period-manage-delivery-time-manage-setup-page" v-if="DeliveryTimeForm">
    <header>
      <p class="mp-common-title-wrap">{{saveType}}发货班次</p>
    </header>
    <main>
      <ul>
        <li>
          <span class="title">名称：</span>
          <div class="content-item">
            <el-input maxlength="15" show-word-limit v-model="DeliveryTimeForm.ItemName" size="small" style="width:400px"></el-input>
          </div>
        </li>
        <li class="f">
          <span class="title">指定区域：</span>
          <div>
            <span class="blue-span" @click="onAreaSelectClick">选择区域</span>
            <!-- 区域展示文字 -->
            <span class="remark" :title="DeliveryTimeForm.AreaDescribe">{{DeliveryTimeForm.AreaDescribe.replaceAll('\r\n', '、')}}</span>
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
          <span class="title">发货班次：</span>
          <div class="content-item">
            <span class="blue-span" @click="onShiftAddClick">+添加</span>
            <ul class='list'>
              <li v-for="(it, i) in DeliveryTimeForm.Shift" :key="it.key">
                <el-time-picker
                  :value="getFormatValue(it.S)"
                  @input="e => onShiftTimeItemInput(e, i)"
                  :clearable='false'
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{ format: 'HH:mm' }"
                  :default-value='defaultBeginTime'
                  placeholder="20:00"
                  size="small"
                >
                </el-time-picker>
                <label>运输时长：</label>
                <el-input v-model="it.D" maxlength="3" size="small" style="width:100px"></el-input>
                <span class="remark">天</span>
                <el-input v-model="it.H" maxlength="2" size="small" style="width:100px"></el-input>
                <span class="remark">小时</span>
                <CtrlMenus v-show="i > 0" :showList="['del']" @remove='onShiftRemoveClick(i)' />
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <ADAreaDialogSelector :visible.sync="visible" v-model="DeliveryTimeForm.AreaList" :AreaDescribe.sync='DeliveryTimeForm.AreaDescribe' />
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import DeliveryTimeItemClass from '@/store/Period/ItemClass/DeliveryTimeItemClass';
import ADAreaDialogSelector from '@/components/common/SelectorComps/ADAreaDialogSelector/index.vue';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  name: 'DeliveryTimeSetupPage',
  components: {
    ADAreaDialogSelector,
    CtrlMenus,
  },
  data() {
    return {
      DeliveryTimeForm: null,
      visible: false,
    };
  },
  computed: {
    // ...mapState('periodManage', ['curPayTimeEditData']),
    ...mapGetters('common', ['subExpressList']),
    ExpressCheckAll: {
      get() {
        return (
          this.DeliveryTimeForm.ExpressList.length > 0
          && this.DeliveryTimeForm.ExpressList.length === this.subExpressList.length
        );
      },
      set(val) {
        const _list = val ? this.subExpressList : [];
        this.DeliveryTimeForm.ExpressList = _list;
      },
    },
    ExpressCheckList: {
      get() {
        return this.DeliveryTimeForm.ExpressList.map((it) => it.ID);
      },
      set(val) {
        const _list = val.map((it) => ({ ID: it }));
        this.DeliveryTimeForm.ExpressList = _list;
      },
    },
    isIndeterminate() {
      if (
        this.DeliveryTimeForm.ExpressList.length === 0
        || this.subExpressList.length === this.DeliveryTimeForm.ExpressList.length
      ) { return false; }
      return (
        this.DeliveryTimeForm.ExpressList.length < this.subExpressList.length
      );
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0));
    },
    saveType() {
      if (this.DeliveryTimeForm && this.DeliveryTimeForm.ItemID) return '编辑';
      return '添加';
    },
  },
  methods: {
    getFormatValue(shiftItem) {
      if (!shiftItem) return '';
      const { F, S } = shiftItem;
      if ((!F && F !== 0) || (!S && S !== 0)) return '';
      const _f = `0${F}`.slice(-2);
      const _s = `0${S}`.slice(-2);
      return `${_f}:${_s}`;
    },
    onShiftTimeItemInput(data, index) {
      if (!data) return;
      const [F, S] = data.split(':');
      this.DeliveryTimeForm.Shift[index].S.F = F;
      this.DeliveryTimeForm.Shift[index].S.S = S;
    },
    onShiftRemoveClick(index) {
      this.DeliveryTimeForm.Shift.splice(index, 1);
    },
    onShiftAddClick() {
      const temp = DeliveryTimeItemClass.generateOneNewShiftItem();
      this.DeliveryTimeForm.Shift.push(temp);
    },
    async onSubmitClick() {
      if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
        this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onAreaSelectClick() {
      this.visible = true;
    },
    filterEditDataExpressList() { // 去除已不在当前配送方式列表中的配送方式
      if (this.subExpressList && this.subExpressList.length > 0 && this.DeliveryTimeForm) {
        const validExpressIDs = this.subExpressList.map(it => it.ID);
        this.DeliveryTimeForm.ExpressList = this.DeliveryTimeForm.ExpressList.filter(it => validExpressIDs.includes(it.ID));
      }
    },
    async getInitItemData() { // 获取初始详情数据以还原使用
      let temp;
      const { ItemID } = this.$route.params;
      if (ItemID !== 'null') {
        const resp = await this.api.getShiftTimeDetail(ItemID).catch(() => null);
        if (resp && resp.data.Status === 1000) temp = resp.data.Data;
      }
      this.DeliveryTimeForm = new DeliveryTimeItemClass(temp);
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
.mp-erp-period-manage-delivery-time-manage-setup-page {
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
          ul.list {
            padding-top: 5px;
            > li {
              margin-bottom: 15px;
              > label {
                color: #585858;
                margin-left: 25px;
                margin-right: 5px;
              }
              > .remark {
                color: #989898;
                font-size: 12px;
                margin-left: 8px;
                margin-right: 16px;
              }
              > .ctrl-menus-container {
                margin-left: 8px;
              }
            }
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
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
