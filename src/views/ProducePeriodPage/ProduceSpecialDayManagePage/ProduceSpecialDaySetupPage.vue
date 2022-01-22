<template>
  <section class="mp-erp-period-manage-produce-special-day-manage-setup-page" v-if="SpecialDayForm">
    <header>
      <p class="mp-common-title-wrap">{{saveType}}生产特殊情况</p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%'>
        <template v-slot:left>
          <div class="l-content">
            <!-- <NewAreaTreeSpreadComp
             v-model="ProductRange"
             :list='allProductClassify'
             title="产品"
             leftWidth='7em'
             rightItemWidth='10em'
             :withNew='false' /> -->
             <TreeComp
              title="名称"
              isProduct
              :treeList='allProductClassify'
              :defaultCheckedKeys='defaultCheckedKeys'
              :handleChangeFunc='handleChangeFunc'
              checkAllTitle='所有产品'
              />
          </div>
        </template>
        <template v-slot:right>
          <ul class="r-content">
            <li>
              <span class="title">标题：</span>
              <div class="content-item">
                <el-input maxlength="20" show-word-limit v-model="SpecialDayForm.ItemName" size="small" style="width:400px"></el-input>
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
            <template v-if="SpecialDayForm.SpecialType === ProduceSpecialTypeEnums.delay.ID">
              <li>
                <span class="title"></span>
                <div class="content-item">
                  <el-radio-group v-model="SpecialDayForm.DelayType" size="small">
                    <el-radio :label="it.ID" v-for="it in DelayTypeList" :key="it.ID">{{it.Name}}</el-radio>
                  </el-radio-group>
                </div>
              </li>
            </template>
            <li>
              <span class="title">开始时间：</span>
              <div class="content-item">
                <el-date-picker
                  v-model="SpecialDayForm.StartTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
                </el-date-picker>
                <el-time-picker
                  v-model="SpecialDayForm.StartTime.Second"
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
                  v-model="SpecialDayForm.EndTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
                </el-date-picker>
                <el-time-picker
                  v-model="SpecialDayForm.EndTime.Second"
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
              <span class="title">{{dateTypeTitle}}：</span>
              <div class="content-item">
                <el-input maxlength="3" v-model.number.trim="SpecialDayForm.ProductionTime" size="small"></el-input>
                <span class="ml-8">小时</span>
              </div>
            </li>
            <!-- </template> -->
            <!-- <template v-if="SpecialDayForm.SpecialType === ProduceSpecialTypeEnums.stop.ID">
              <li>
                <span class="title">结束时间：</span>
                <div class="content-item">
                  <el-date-picker
                    v-model="SpecialDayForm.StopEndTime.First" value-format="yyyy-MM-dd" type="date" placeholder=" 年 / 月 / 日">
                  </el-date-picker>
                </div>
              </li>
            </template> -->
            <li>
              <span class="title">给客户的提示：</span>
              <div class="content-item">
                <el-input maxlength="40" show-word-limit v-model="SpecialDayForm.Tips" size="small" style="width:600px"></el-input>
              </div>
            </li>
          </ul>
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" :disabled='hasError' @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
      <span v-if="hasError" class="is-pink is-font-size-12" style="margin-left:30px">获取详情数据发生错误，请退出重进</span>
    </footer>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProduceSpecialDayItemClass,
{ ProduceSpecialTypeEnumList, ProduceDelayTypeEnumList, ProduceSpecialTypeEnums } from '@/store/Period/ItemClass/ProduceSpecialDayItemClass';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
// import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';
import TreeComp from '@/components/common/TreeComp.vue';

export default {
  name: 'ProduceSpecialDaySetupPage',
  components: {
    LRWidthDragAutoChangeComp,
    // NewAreaTreeSpreadComp,
    TreeComp,
  },
  data() {
    return {
      SpecialDayForm: null,
      SpecialTypeList: ProduceSpecialTypeEnumList,
      DelayTypeList: ProduceDelayTypeEnumList,
      ProduceSpecialTypeEnums,
      hasError: false,
    };
  },
  computed: {
    ...mapGetters('common', ['allProductClassify']),
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0));
    },
    saveType() {
      if (this.SpecialDayForm && this.SpecialDayForm.ItemID) return '编辑';
      return '添加';
    },
    defaultCheckedKeys() {
      if (!this.SpecialDayForm) return [];
      return this.SpecialDayForm.ProductList.map(it => it.productID);
    },
    dateTypeTitle() {
      if (!this.SpecialDayForm) return '';
      if (this.SpecialDayForm.SpecialType === ProduceSpecialTypeEnums.delay.ID) return '延长工时';
      if (this.SpecialDayForm.SpecialType === ProduceSpecialTypeEnums.stop.ID) return '可生产工期';
      return '';
    },
  },
  methods: {
    ...mapActions('common', ['getProductClassifyData', 'getAllProductNames']),
    async onSubmitClick() {
      if (ProduceSpecialDayItemClass.submitChecker(this.SpecialDayForm)) {
        const temp = ProduceSpecialDayItemClass.transform(this.SpecialDayForm);
        const callback = () => {
          this.onGoBackClick();
        };
        this.$store.dispatch('periodManage/getProduceSpecialDayItemSave', [temp, callback]);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    async getInitItemData() { // 获取初始详情数据以还原使用
      let temp;
      const { ItemID } = this.$route.params;
      if (ItemID !== 'null') {
        this.hasError = false;
        const resp = await this.api.getProduceSpecialDayDetail(ItemID).catch(() => null);
        if (resp && resp.data.Status === 1000) temp = resp.data.Data;
        else this.hasError = true;
      }
      this.SpecialDayForm = new ProduceSpecialDayItemClass(temp);
    },
    handleChangeFunc(checkedNodes) {
      if (!this.SpecialDayForm) return;
      const _list = checkedNodes.filter(_it => _it.ShowName).map(_it => {
        const t = _it.ClassifyList.find(({ Type }) => Type === 1);
        if (t) {
          return {
            classID: t.FirstLevel.ID,
            typeID: t.SecondLevel.ID,
            productID: _it.ID,
            // ProductName: _it.Name,
          };
        }
        return null;
      }).filter(_it => _it);
      this.SpecialDayForm.ProductList = _list;
    },
  },
  created() {
    this.getInitItemData();
    this.getProductClassifyData({ key: 6 });
    this.getAllProductNames();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-produce-special-day-manage-setup-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  > header {
    flex: none;
    padding: 35px 45px;
    background-color: #fff;
    align-items: center;
  }
  > main {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
    .mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
      > .left {
        .l-content {
          padding-left: 50px;
          > .mp-common-comps-tree-comp-wrap {
            > header {
              font-weight: 700;
              font-size: 14px;
              color: #444;
              padding-bottom: 12px;
            }
          }
        }
      }
    }
    ul.r-content {
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
        &:first-of-type {
          margin-bottom: 60px;
        }
      }
    }
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 75px;
    text-align: center;
    padding-top: 25px;
    button.el-button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
      & + button {
        margin-left: 30px;
      }
    }
  }
}
</style>
