<template>
  <section class="mp-common-comps-staff-selector-wrap" :class="isLineStyle ? 'isLineStyle' : ''">
    <header>{{title}}：</header>
    <main>
      <remote-select-comp
        mini
        :value="value"
        :isDisabled="isDisabled"
        :defaultProps="defaultProps"
        @handleChange="handleChange"
        :requestListFunc="requestListFunc"
        :watchValue="watchValue"
        :remote="remote"
        :needlimit="needlimit"
        :staffList="staffList"
        :class="showArrow ? 'mp-common-select-comp-wrap' : ''"
      />
    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import RemoteSelectComp from '../RemoteSelectComp.vue';

export default {
  props: {
    title: {
      type: String,
      default: '申请人',
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
      // required: true,
    },
    typeList: {
      type: Array,
      // required: true,
      default: () => [],
    },
    value: {
      default: '',
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    watchValue: {},
    isDisabled: {
      type: Boolean,
      default: false,
    },
    needlimit: {
      // 是否需要添加不限选项，默认不需要
      type: Boolean,
      default: false,
    },
    isLineStyle: {
      default: false,
      type: Boolean,
    },
    showArrow: {
      default: false,
      type: Boolean,
    },
    remote: { // 是否为即时远程请求方式获取列表数据
      type: Boolean,
      default: true,
    },
  },
  components: {
    RemoteSelectComp,
  },
  data() {
    return {
      defaultProps: {
        label: 'StaffName',
        value: 'StaffID',
      },
    };
  },
  computed: {
    ...mapState('common', ['staffList']),
  },
  methods: {
    handleChange(newVal) {
      this.changePropsFunc([this.typeList[0], newVal]);
      if (this.requestFunc) this.requestFunc();
    },
    async requestListFunc(query) {
      const res = await this.api.getStaffList({
        FieldType: 1,
        Page: 1,
        PageSize: 20,
        KeyWords: query.trim(),
      });
      return res;
    },
  },
  mounted() {
    if (!this.remote) {
      this.$store.dispatch('common/getStaffList');
    }
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-staff-selector-wrap {
  display: flex;
  height: 25px;
  > header {
    font-size: 14px;
    font-weight: 600;
    line-height: 25px;
    color: $--color-text-primary;
    width: 5em;
    margin-right: 15px;
    text-align: right;
  }
  &.isLineStyle {
    .mp-common-remote-select-comp-wrap .el-input > input {
      width: 113px;
      border: none;
      border-bottom: 1px solid $--color-text-secondary;
      border-radius: 0;
      // .mp-common-select-comp-wrap .el-input::after {
      //   content: "";
      //   position: absolute;
      //   background: url() no-repeat center;
      //   background-size: 100% 100%;
      //   height: 9px;
      //   width: 11px;
      //   right: 5px;
      //   top: 5px;
      // }
    }
    // > header {
    //   &::after {

    //   }
    // }
  }
}
</style>
