<template>
  <section class="mp-erp-staff-manage-setup-page-left-comp-wrap">
    <header>
      <p class="mp-common-title-wrap">员工信息</p>
    </header>
    <main>
      <el-form :model="staffForm" ref="ruleForm" label-width="120px" hide-required-asterisk size="mini">
        <el-form-item
          label="员工真实姓名："
          prop="StaffName"
          :rules="[
            { required: true, message: '姓名不能为空'},
          ]"
        >
          <el-input class="line" :value="staffForm.StaffName" @input="val => change([['StaffName'], val])" maxlength="18" placeholder='请输入员工姓名'></el-input>
        </el-form-item>
        <el-form-item
          label="手机号："
          prop="Mobile"
          :rules="[
            { required: true, message: '手机号不能为空'},
            { pattern: /1[3456789]\d{9}/, message: '手机号码格式不正确' },
          ]"
        >
          <el-input class="line" :value="staffForm.Mobile" @input="val => change([['Mobile'], val])" maxlength="11" placeholder='请输入手机号'></el-input>
        </el-form-item>
        <el-form-item
          label="密码："
          prop="Password"
          :rules="[
            { required: !isEdit, message: '密码不能为空'},
            { min: 6, message: '密码至少为6位' },
          ]"
        >
          <el-input class="line" :value="staffForm.Password" @input="v => change([['Password'], v])" maxlength="16" :placeholder="isEdit ? '不修改密码请留空':'请输入密码'"/>
        </el-form-item>
        <el-form-item
          label="身份证号码："
          prop="IDCard"
          :rules="[
            { required: true, message: '身份证号码不能为空'},
            { validator: idCardvalidator, message: '身份证号码不正确' },
          ]"
        >
          <el-input class="line" :value="staffForm.IDCard" @input="val => change([['IDCard'], val])" maxlength="18" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="学历：" class="f">
          <OrderChannelSelector
            :options='EducationEnumList'
            :changePropsFunc="change"
            :typeList="[['Education', '']]"
            :value='staffForm.Education'
            :defaultProps='{label: "Name", value: "ID"}'
            :showLabel='false'
          />
        </el-form-item>
        <el-form-item
          label="地址："
          class="f"
          prop="DetailAddress"
          :rules="[
            { required: true, message: '详细地址不能为空'},
          ]"
        >
          <CascadeSelector :tree-data="allAdAreaTreeList" :cascadeList='cascadeList' :index='0' auto />
          <el-input class="line" :value="staffForm.DetailAddress" @input="val => change([['DetailAddress'], val])" maxlength="40" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="入职日期："
          prop="TimeRecord.JoinDate"
          :rules="[
            { required: true, message: '入职日期不能为空'},
          ]"
        >
          <el-date-picker class="line" v-model="localDate" value-format="yyyy-MM-dd" placeholder="入职日期"></el-date-picker>
        </el-form-item>
      </el-form>
    </main>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import CascadeSelector from '@/components/common/SelectorComps/CascadeSelector';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import { validateIdCard } from '../../assets/js/utils/IdCardvalidator';
import { EducationEnumList } from '../../assets/js/TypeClass/StaffManage/enums';

export default {
  props: {
    staffForm: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    CascadeSelector,
    OrderChannelSelector,
  },
  computed: {
    ...mapGetters('common', ['allAdAreaTreeList']),
    isEdit() {
      return !!this.staffForm.StaffID;
    },
    localDate: {
      get() {
        return this.staffForm.TimeRecord?.JoinDate ? this.staffForm.TimeRecord.JoinDate.split('T')[0].substring(0, 10) : '';
      },
      set(val) {
        let timer = '';
        if (val) timer = `${val}T00:00:00.000Z`;
        this.change([['TimeRecord', 'JoinDate'], timer]);
      },
    },
  },
  data() {
    return {
      EducationEnumList,
      cascadeList: [
        {
          parentKey: 'ParentID',
          defaultProps: { label: 'Name', value: 'ID' },
          initParentID: -1,
          label: '',
          getValue: () => this.staffForm.LinkArea.RegionalID,
          changeFunc: (val) => {
            this.change([['LinkArea', 'RegionalID'], val]);
          },
        },
        {
          parentKey: 'ParentID',
          defaultProps: { label: 'Name', value: 'ID' },
          initParentID: -1,
          label: '',
          getValue: () => this.staffForm.LinkArea.CityID,
          changeFunc: (val) => {
            this.change([['LinkArea', 'CityID'], val]);
          },
        },
      ],
    };
  },
  methods: {
    change(data) {
      this.$emit('change', data);
    },
    idCardvalidator(rule, value, callback) { // 身份证校验函数
      if (validateIdCard(value)) {
        callback();
        return;
      }
      callback(new Error());
    },
    async submitForm() {
      const result = await this.$refs.ruleForm.validate().catch(() => false);
      return result;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-setup-page-left-comp-wrap {
  width: 450px;
  height: 100%;
  border-right: 1px solid #eee;
  padding-right: 90px;
  box-sizing: border-box;
  > main {
    padding-top: 25px;
    .el-form-item {
      &.f {
        .el-form-item__content {
          padding-top: 3px;
          .mp-common-comps-order-channel-selector-wrap {
            input {
              border-color: #cbcbcb;
            }
            &:first-of-type {
              margin-left: 0;
            }
            &:nth-of-type(2) {
              margin-left: 19px;
            }
          }
          .mp-erp-common-comps-cascade-selector-comp-wrap {
            height: 26px;
          }
        }
      }
      .el-date-editor {
        width: 110px;
        input {
          padding-right: 0;
        }
        .el-input__suffix {
          display: none;
        }
      }
      .el-input input {
        font-size: 13px;
        &::placeholder {
          color: #aaa;
        }
      }
    }
  }
}
</style>
