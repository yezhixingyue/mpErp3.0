<template>
  <el-form v-if="ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" class="customer-second-ruleForm-wrap" @submit.native.prevent>
    <el-form-item label="经营地址：" size="small">
      <AreaAddressInfoSetupComp class="address-select" v-model="ruleForm.AuthenInfo.SellArea" :allAreaDataList='allAdAreaTreeList' />
    </el-form-item>
    <el-form-item prop="AuthenInfo.DetailAddress" size="small">
      <el-input v-model.trim="ruleForm.AuthenInfo.DetailAddress" maxlength="30" class="detail-input" show-word-limit placeholder="在此输入详细地址"></el-input>
    </el-form-item>
    <el-form-item size="small" label="配送地址：">
      <ul class="express-address-list" v-show="ruleForm.Address.length > 0">
        <li v-for="(it, i) in ruleForm.Address" :key="it.AddressID || it.key || i">
          <div v-if="it.ExpressArea">
            <span :title="it.ExpressArea.RegionalName">{{it.ExpressArea.RegionalName}}</span>
            <span :title="it.ExpressArea.CityName">{{it.ExpressArea.CityName}}</span>
            <span :title="it.ExpressArea.CountyName">{{it.ExpressArea.CountyName}}</span>
            <span :class="{'is-success': it.HavePosition, 'is-pink': !it.HavePosition, p: 1}">( {{it.HavePosition ? '已定位' : '未定位'}} )</span>
          </div>
          <div>
            <span :title="it.AddressDetail">{{it.AddressDetail}}</span>
          </div>
          <div>
            <span class="Consignee" :title="it.Consignee">{{it.Consignee}}</span>
            <span :title="it.Mobile">{{it.Mobile}}</span>
            <CtrlMenus @edit='onAddressItemSaveClick(it, i)' @remove='onAddressItemRemoveClick(it, i)' />
          </div>
        </li>
      </ul>
      <el-button
       class="cancel-blue-btn"
       @click="onAddressItemSaveClick(null)"
       :disabled='ruleForm.Address.length >= 3'
       title="最多可添加3条配送地址">+ 增加一条配送地址</el-button>
      <AddMapComp
        isEmitType
        top='5vh'
        :openType="openType"
        :canClose='false'
        :visible.sync="visible"
        :curEditInfo="curEditAddressInfo"
        :allAreaDataList='allAdAreaTreeList'
        @submit="handleAddressSubmit"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Customer from '@/store/customerManage/Customer';
import AddMapComp from '@/components/common/NewComps/ConsigneeAddressSetpComp/AddMapComp';
import Address from '@/store/customerManage/Address';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import AreaAddressInfoSetupComp from '../../common/SelectorComps/AreaAddressInfoSetupComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    AreaAddressInfoSetupComp,
    AddMapComp,
    CtrlMenus,
  },
  computed: {
    ...mapState('common', ['userTypeListNoneEmpty', 'userRankListNoneEmpty']),
    ...mapGetters('common', ['allAdAreaTreeList']),
  },
  data() {
    return {
      ruleForm: null,
      rules: {
        AuthenInfo: {
          DetailAddress: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { max: 30, message: '请控制在30个字符以内', trigger: 'blur' },
          ],
        },
      },
      visible: false,
      curEditAddressInfo: null,
      openType: 'edit',
      curEditIndex: 0,
    };
  },
  methods: {
    async initData() {
      this.ruleForm = new Customer(this.customer);
    },
    async submitForm(formName = 'ruleForm') {
      const bool = await this.$refs[formName].validate().catch(() => false);
      return bool ? this.ruleForm : false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    onAddressItemSaveClick(item, index) {
      this.openType = item ? 'edit' : 'new';
      this.curEditIndex = item ? index : 0;
      this.curEditAddressInfo = new Address(item);
      this.visible = true;
    },
    onAddressItemRemoveClick(item, index) {
      this.ruleForm.Address.splice(index, 1);
    },
    handleAddressSubmit(data, type) {
      if (type === 'new') {
        this.ruleForm.Address.push({ ...data, key: Math.random().toString(32).slice(-8) });
      } else {
        this.ruleForm.Address.splice(this.curEditIndex, 1, { ...data, key: Math.random().toString(32).slice(-8) });
      }
    },
  },
  async mounted() {
    this.initData();
  },
};
</script>
<style lang='scss'>
.customer-second-ruleForm-wrap {
  > .el-form-item {
    > .el-form-item__label {
      color: #888e99;
    }
    > .el-form-item__content {
      .el-select {
        width: 134px;
        & + .el-select {
          margin-left: 11px;
        }
      }
      .address-select {
        // margin-bottom: 10px;
        .el-select {
          width: 92px;
        }
      }
      .el-button {
        width: 150px;
        height: 32px;
      }
      .el-checkbox__label {
        color: #585858;
        font-size: 13px;
      }
      .el-input {
        height: 32px;
        > input {
          position: relative;
          top: -2px;
        }
        &.detail-input > input {
          padding-right: 50px;
        }
      }
      ul.express-address-list {
        padding-bottom: 15px;
        > li {
          padding: 6px 0;
          margin-bottom: 12px;
          color: #585858;
          border-bottom: 1px solid #eee;
          > div {
            line-height: 24px;
            font-size: 13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            > span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &:not(:last-of-type) {
                margin-right: 1em;
              }
              &.Consignee {
                max-width: 16em;
              }
              &.p {
                flex: none;
              }
            }
            > .ctrl-menus-container {
              margin-left: 1em;
            }
          }
        }
      }
    }
  }
}
</style>
