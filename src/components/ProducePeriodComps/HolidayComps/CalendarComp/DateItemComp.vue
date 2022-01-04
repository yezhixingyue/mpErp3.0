<template>
<!-- @contextmenu="onContextmenuclick" @click="onBoxClick"  左键右键切换该方法即可 -->
  <li
    ref="oItem"
    @contextmenu="onBoxClick"
    @click="onContextmenuclick"
    class="mp-erp-period-holiday-item-setup-dialog-calendar-date-item-comp-wrap"
    :title="title"
    :class="{
      date: true,
      hidden: item.hidden,
      empty: item.empty,
      resting: item.resting,
      working: item.working,
      disabled: item.disabled,
      isBefore: isBefore,
      visible: visible,
    }">
      <span>{{`0${item.d}`.slice(-2)}}</span>
      <span class="lunar">{{item.lunarCalendar | formatLunarCalendar}}</span>
      <transition name="el-fade-in-linear">
        <div v-show="visible" class="context-box" @click.stop @contextmenu.stop='e => e.preventDefault()'>
          <span :class="{disabled: item.resting}" @click="onMenuChangeClick('resting')">休息</span>
          <span :class="{disabled: item.working}" @click="onMenuChangeClick('working')">工作</span>
          <span :class="{disabled: item.empty}" @click="onMenuChangeClick('empty')">未设置</span>
        </div>
      </transition>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    formatLunarCalendar(lunarCalendar) {
      if (!lunarCalendar) return ''; // 关于农历lunarCalendar： IDayCn：'初四'  Term：24节气  festival：阳历节日  lfestival：农历节日
      const { lunarFestival, festival, Term, IDayCn, IMonthCn } = lunarCalendar;
      const c = lunarFestival || festival || Term || IDayCn;
      return c === '初一' ? IMonthCn : c;
    },
  },
  data() {
    return {
      visible: false,
      todayTime: 0,
    };
  },
  computed: {
    isBefore() {
      if (this.item) {
        const { y, m, d } = this.item;
        const t = new Date(y, m, d).getTime();
        return t < this.todayTime;
      }
      return false;
    },
    title() {
      if (this.item.hidden) return '非选中月份，不可设置';
      let str = '';
      if (this.isBefore) str += '已过期，';
      if (this.item.resting) str += '休息';
      if (this.item.empty) str += '未设置';
      if (this.item.working) str += '工作';
      if (this.item.disabled) str += '不可选';
      return str;
    },
  },
  methods: {
    onContextmenuclick(e) {
      if (this.isBefore) {
        e.stopPropagation();
      } else if (!this.item.hidden && !this.item.disabled) {
        this.visible = !this.visible;
      }
      e.preventDefault();
    },
    onDocumentClick(e) {
      if (!this.visible) return;
      if (this.$refs.oItem && (e.target === this.$refs.oItem || e.target.parentNode === this.$refs.oItem)) return;
      this.visible = false;
    },
    onBoxClick(e) {
      if (this.isBefore) {
        e.stopPropagation();
        return;
      }
      if (this.visible) this.visible = !this.visible;
    },
    onMenuChangeClick(type) {
      if (this.item[type]) return;
      const temp = {
        item: this.item,
        type,
      };
      this.$emit('change', temp);
      this.visible = !this.visible;
    },
  },
  mounted() {
    const y = new Date().getFullYear();
    const m = new Date().getMonth();
    const d = new Date().getDate();
    this.todayTime = new Date(y, m, d).getTime();
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('contextmenu', this.onDocumentClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('contextmenu', this.onDocumentClick);
  },
};
</script>
<style lang='scss'>
.mp-erp-period-holiday-item-setup-dialog-calendar-date-item-comp-wrap {
  position: relative;
  > .context-box {
    position: absolute;
    width: 95px;
    height: 120px;
    top: 50%;
    left: calc(100% + 5px);
    transform: translateY(-75%);
    background-color: #fff;
    z-index: 9;
    box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, 0.35);
    border-radius: 1px;
    border: 1px solid #f5f5f5;
    border-bottom: none;
    border-right: none;
    color: #585858;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
    justify-content: center;
    font-size: 13px;
    > span {
      width: 100%;
      padding: 9px 20px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      &.disabled {
        cursor: not-allowed;
        // pointer-events: none;
        color: #cbcbcb;
      }
    }
  }
  &.isBefore {
    // cursor: not-allowed;
    // pointer-events: none;
    cursor: auto;
    opacity: 0.4;
  }
  &.visible {
    > span:first-of-type {
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
    }
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.4);
  }
}
</style>
