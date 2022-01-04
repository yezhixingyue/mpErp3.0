<template>
  <section class="mp-erp-period-manage-special-day-manage-setup-page" v-if="SpecialDayForm">
    <header>
      <p class="mp-common-title-wrap">{{saveType}}特殊情况</p>
    </header>
    <main>
      <ul>
        <li class="f">
          <span class="title">指定区域：</span>
          <div>
            <span class="blue-span" @click="onAreaSelectClick">选择区域</span>
            <!-- 区域展示文字 -->
            <span class="remark" :title="SpecialDayForm.AreaDescribe">{{SpecialDayForm.AreaDescribe.replaceAll('\r\n', '、')}}</span>
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
          <span class="title"></span>
          <div class="content-item">
            <el-radio-group v-model="SpecialDayForm.SpecialType" size="small">
              <el-radio-button :label="it.ID" v-for="it in SpecialTypeList" :key="it.ID">{{it.Name}}</el-radio-button>
            </el-radio-group>
          </div>
        </li>
        <template v-if="SpecialDayForm.SpecialType === SpecialTypeEnums.delay.value">
          <li>
            <span class="title"></span>
            <div class="content-item">
              <el-radio-group v-model="SpecialDayForm.DelayType" size="small">
                <el-radio :label="it.ID" v-for="it in DelayTypeList" :key="it.ID">{{it.Name}}</el-radio>
              </el-radio-group>
            </div>
          </li>
          <li>
            <span class="title">开始时间：</span>
            <div class="content-item">
              <el-date-picker
                v-model="SpecialDayForm.DelayStartTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
              </el-date-picker>
              <el-time-picker
                v-model="SpecialDayForm.DelayStartTime.Second"
                :clearable='false'
                value-format="HH:mm"
                format="HH:mm"
                :picker-options="{ format: 'HH:mm' }"
                size="small"
                :default-value='defaultBeginTime'
                placeholder="00:00"
                style="width: 100px"
              >
              </el-time-picker>
            </div>
          </li>
          <li>
            <span class="title">结束时间：</span>
            <div class="content-item">
              <el-date-picker
                v-model="SpecialDayForm.DelayEndTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
              </el-date-picker>
              <el-time-picker
                v-model="SpecialDayForm.DelayEndTime.Second"
                :clearable='false'
                value-format="HH:mm"
                format="HH:mm"
                :picker-options="{ format: 'HH:mm' }"
                size="small"
                :default-value='defaultBeginTime'
                placeholder="00:00"
                style="width: 100px"
              >
              </el-time-picker>
            </div>
          </li>
          <li>
            <span class="title">延长工时：</span>
            <div class="content-item">
              <el-input maxlength="3" v-model.number.trim="SpecialDayForm.DelayTime" size="small"></el-input>
              <span class="ml-8">小时</span>
            </div>
          </li>
        </template>
        <template v-if="SpecialDayForm.SpecialType === SpecialTypeEnums.stop.value">
          <li>
            <span class="title">结束时间：</span>
            <div class="content-item">
              <el-date-picker
                v-model="SpecialDayForm.StopEndTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
              </el-date-picker>
            </div>
          </li>
        </template>
        <li>
          <span class="title">给客户的提示：</span>
          <div class="content-item">
            <el-input maxlength="40" show-word-limit v-model="SpecialDayForm.Tips" size="small" style="width:600px"></el-input>
          </div>
        </li>
      </ul>
      <ADAreaDialogSelector :visible.sync="visible" v-model="SpecialDayForm.AreaList" :AreaDescribe.sync='SpecialDayForm.AreaDescribe' />
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import SpecialDayItemClass, { SpecialTypeEnumList, DelayTypeEnumList, SpecialTypeEnums } from '@/store/Period/ItemClass/SpecialDayItemClass';
import ADAreaDialogSelector from '@/components/common/SelectorComps/ADAreaDialogSelector/index.vue';

export default {
  name: 'SpecialDaySetupPage',
  components: {
    ADAreaDialogSelector,
  },
  data() {
    return {
      SpecialDayForm: null,
      visible: false,
      SpecialTypeList: SpecialTypeEnumList,
      DelayTypeList: DelayTypeEnumList,
      SpecialTypeEnums,
    };
  },
  computed: {
    // ...mapState('periodManage', ['curPayTimeEditData']),
    ...mapGetters('common', ['subExpressList']),
    ExpressCheckAll: {
      get() {
        return (
          this.SpecialDayForm.ExpressList.length > 0
          && this.SpecialDayForm.ExpressList.length === this.subExpressList.length
        );
      },
      set(val) {
        const _list = val ? this.subExpressList : [];
        this.SpecialDayForm.ExpressList = _list;
      },
    },
    ExpressCheckList: {
      get() {
        return this.SpecialDayForm.ExpressList.map((it) => it.ID);
      },
      set(val) {
        const _list = val.map((it) => ({ ID: it }));
        this.SpecialDayForm.ExpressList = _list;
      },
    },
    isIndeterminate() {
      if (
        this.SpecialDayForm.ExpressList.length === 0
        || this.subExpressList.length === this.SpecialDayForm.ExpressList.length
      ) { return false; }
      return (
        this.SpecialDayForm.ExpressList.length < this.subExpressList.length
      );
    },
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0));
    },
    saveType() {
      if (this.SpecialDayForm && this.SpecialDayForm.ItemID) return '编辑';
      return '添加';
    },
  },
  methods: {
    async onSubmitClick() {
      if (SpecialDayItemClass.submitChecker(this.SpecialDayForm)) {
        const temp = SpecialDayItemClass.transform(this.SpecialDayForm);
        this.$store.dispatch('periodManage/getSpecialDayItemSave', [temp, this.onGoBackClick]);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onAreaSelectClick() {
      this.visible = true;
    },
    filterEditDataExpressList() { // 去除已不在当前配送方式列表中的配送方式
      if (this.subExpressList && this.subExpressList.length > 0 && this.SpecialDayForm) {
        const validExpressIDs = this.subExpressList.map(it => it.ID);
        this.SpecialDayForm.ExpressList = this.SpecialDayForm.ExpressList.filter(it => validExpressIDs.includes(it.ID));
      }
    },
    async getInitItemData() { // 获取初始详情数据以还原使用
      let temp;
      const { ItemID } = this.$route.params;
      if (ItemID !== 'null') {
        const resp = await this.api.getSpecialDayDetail(ItemID).catch(() => null);
        if (resp && resp.data.Status === 1000) temp = resp.data.Data;
      }
      this.SpecialDayForm = new SpecialDayItemClass(temp);
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
.mp-erp-period-manage-special-day-manage-setup-page {
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
              font-size: 13px;
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
          .el-radio-group {
            .el-radio-button {
              width: 140px;
              .el-radio-button__inner {
                width: 100%;
                font-size: 14px;
                padding-top: 8px;
                padding-bottom: 8px;
                position: relative;
                color: #444;
                &::before {
                  content: '';
                  position: absolute;
                  height: 5px;
                  width: 5px;
                  border-radius: 50%;
                  background-color: #fff;
                  top: 13px;
                  left: 18px;
                  opacity: 0;
                  transition: opacity 0.15s;
                }
              }
              &.is-active {
                .el-radio-button__inner {
                  color: #fff;
                  &::before {
                    opacity: 1;
                  }
                }
              }
            }
            .el-radio__label {
              color: #444;
            }
          }
          .el-date-editor--date {
            margin-right: 20px;
          }
          .ml-8 {
            margin-left: 8px;
            color: #989898;
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
