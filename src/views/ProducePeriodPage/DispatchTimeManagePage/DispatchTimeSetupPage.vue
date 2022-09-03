<template>
  <section class="mp-erp-period-manage-dispatch-time-manage-setup-page" v-if="DispatchTimeForm">
    <header>
      <p class="mp-common-title-wrap">{{saveType}}派件时间</p>
    </header>
    <main>
      <ul>
        <li>
          <span class="title">名称：</span>
          <div class="content-item">
            <el-input maxlength="15" show-word-limit v-model="DispatchTimeForm.ItemName" size="small" style="width:400px"></el-input>
          </div>
        </li>
        <li class="f">
          <span class="title">指定区域：</span>
          <div class="mp-scroll-wrap">
            <ADAreaTreeContentComp ref="oTreeWrap" v-model="DispatchTimeForm.AreaList" />
          </div>
        </li>
        <li>
          <span class="title">当天最迟派件时间：</span>
          <div class="content-item">
            <el-time-picker
              v-model="LatestDispatchTime"
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              :default-value='defaultBeginTime'
              placeholder="20:00"
              size="small"
            >
            </el-time-picker>
            <p class="tips-box"> <i class="el-icon-warning"></i> 注：在此时间之前到达网点的货物，可送达客户手中</p>
          </div>
        </li>
      </ul>
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import DispatchTimeItemClass from '@/store/Period/ItemClass/DispatchTimeItemClass';
import ADAreaTreeContentComp from '@/components/common/SelectorComps/ADAreaDialogSelector/ADAreaTreeContentComp.vue';

export default {
  name: 'DispatchTimeSetupPage',
  components: {
    ADAreaTreeContentComp,
  },
  data() {
    return {
      DispatchTimeForm: null,
      visible: false,
    };
  },
  computed: {
    // ...mapState('periodManage', ['curPayTimeEditData']),
    ...mapGetters('common', ['subExpressList']),
    defaultBeginTime() {
      return new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0));
    },
    saveType() {
      if (this.DispatchTimeForm && this.DispatchTimeForm.ItemID) return '编辑';
      return '添加';
    },
    LatestDispatchTime: {
      get() {
        if (!this.DispatchTimeForm) return '';
        const { First, Second } = this.DispatchTimeForm.LatestDispatchTime;
        if ((!First && First !== 0) || (!Second && Second !== 0)) return '';
        const _f = `0${First}`.slice(-2);
        const _s = `0${Second}`.slice(-2);
        return `${_f}:${_s}`;
      },
      set(val) {
        if (!val) return;
        const [First, Second] = val.split(':');
        this.DispatchTimeForm.LatestDispatchTime.First = First;
        this.DispatchTimeForm.LatestDispatchTime.Second = Second;
      },
    },
  },
  methods: {
    async onSubmitClick() {
      if (DispatchTimeItemClass.submitChecker(this.DispatchTimeForm)) {
        this.DispatchTimeForm.AreaDescribe = this.$refs.oTreeWrap.getTextDisplayContent();
        this.$store.dispatch('periodManage/getDispatchTimeItemSave', [this.DispatchTimeForm, this.onGoBackClick]);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onAreaSelectClick() {
      this.visible = true;
    },
    async getInitItemData() { // 获取初始详情数据以还原使用
      let temp;
      const { ItemID } = this.$route.params;
      if (ItemID !== 'null') {
        const resp = await this.api.getDispatchTimeDetail(ItemID).catch(() => null);
        if (resp && resp.data.Status === 1000) temp = resp.data.Data;
      }
      this.DispatchTimeForm = new DispatchTimeItemClass(temp);
    },
  },
  created() {
    this.getInitItemData();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-dispatch-time-manage-setup-page {
  background-color: #f5f5f5;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 1000px;
  > header {
    flex: none;
    padding: 25px 45px;
    background-color: #fff;
    align-items: center;
  }
  > main {
    flex: 1;
    background-color: #fff;
    overflow: hidden;
    > ul {
      width: 850px;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      > li {
        flex: none;
        display: flex;
        line-height: 30px;
        margin-bottom: 20px;
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
          .tips-box {
            margin-top: 15px;
            width: 400px;
            letter-spacing: 0.5px;
          }
        }
        &.f {
          margin-bottom: 25px;
          flex: 1;
          overflow: hidden;
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
          .mp-erp-ad-area-content-selector-comp-for-new-wrap > header {
            display: none;
          }
          > .mp-scroll-wrap {
            height: 100%;
            overflow-y: auto;
            width: 710px;
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 80px;
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
