<template>
  <div class="mpzj-sell-lib-comps-ep-cascader-comp-wrap" :class="{'show-line':showLine}">
    <label class="title">{{title}}：</label>
    <el-popover
      placement="bottom-start"
      popper-class="mpzj-sell-lib-comps-ep-cascader-comp-popper-wrap"
      trigger="manual"
      ref="oPop"
      transition="el-zoom-in-top"
      v-model="visible">
      <el-button slot="reference" :style="`width:${fiexdWidth ? fiexdWidth + 'px' : ''}`" ref="oBtn"
       size="small" class="btn" @click="open" :class="{active:visible,none:label.length===0&&!withEmpty}"
       >{{label.join(' / ')||(withEmpty?'不限':'请选择')}}</el-button>
      <div class="display-content" v-clickoutside="close">
        <ListComp
          v-for="(it, i) in cascaderList"
          :key="it.key"
          :list="it.list"
          :activeIds="activeIds"
          :selectedIds="value"
          :withEmpty="withEmpty"
          :onlyLastValid="onlyLastValid"
          :defaultProps="defaultProps"
          :isLast="level ? i >= (level - 1) : false"
          @hoverItem="e => onItemHover(i, e)"
          @itemClick="onItemClick(i)"
        />
        <div class="empty" v-if="cascaderList.length === 0">
          <span>暂无数据</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
// import Clickoutside from 'element-ui/src/utils/clickoutside';
import ListComp from './ListComp.vue';
import { debounce } from '../../../js/utils/throttle';

export default {
  name: 'EpCascader',
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    withEmpty: {
      type: Boolean,
      default: true,
    },
    showLine: { // 显示样式
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: () => ({
        ID: 'ID',
        Name: 'ClassName',
        children: 'children',
      }),
    },
    fiexdWidth: { // 是否固定宽度 如果传的有值则使用固定宽度
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '产品',
    },
    onlyLastValid: { // 仅最后一个生效（可点击）
      type: Boolean,
      default: false,
    },
    level: { // 下拉展示等级数量  若要启用 则传入数值类型
      default: '',
    },
  },
  components: {
    ListComp,
  },
  directives: {
    // Clickoutside,
  },
  data() {
    return {
      visible: false,
      activeIds: [],
      cascaderList: [],
      popWrap: null,
      initialLeft: 0,
    };
  },
  computed: {
    localList() {
      return this.withEmpty ? [{ [this.defaultProps.ID]: '', [this.defaultProps.Name]: '不限' }, ...this.list] : this.list;
    },
    label() {
      let curList = this.localList;
      return this.value.reduce((arr, id) => {
        const t = curList.find((it) => it[this.defaultProps.ID] === id);
        if (t) {
          arr.push(t[this.defaultProps.Name]);
        }
        curList = t ? t[this.defaultProps.children] || [] : [];
        return arr;
      }, []);
    },
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
      this.setInitState();
    },
    getInitialLeft() {
      if (!this.$refs.oBtn || !this.$refs.oBtn.$el) return;
      const result = this.$refs.oBtn.$el.getBoundingClientRect();
      if (result) {
        this.initialLeft = result.left;
      }
    },
    async handleLeftChange() { // 处理左右位置的变化
      if (!this.popWrap) {
        this.popWrap = this.$refs.oPop.$refs.popper;
      }
      if (!this.popWrap) return;
      await this.$nextTick();
      if (!this.initialLeft) {
        this.getInitialLeft();
      }
      if (!this.initialLeft) return;
      const totalWidth = this.popWrap.offsetWidth + this.initialLeft;
      const maxDisplayWidth = window.innerWidth;
      let dis = this.initialLeft;
      if (totalWidth > maxDisplayWidth) {
        dis = this.initialLeft - (totalWidth - maxDisplayWidth) - 10;
        if (dis < 0) dis = 0;
      }
      this.popWrap.style.left = `${dis}px`;
    },
    setInitState() { // 设置初始状态
      if (this.visible) {
        this.cascaderList = [{ list: this.localList, key: Math.random().toString(16).slice(-10) }];
        if (this.value.length > 0) {
          this.activeIds = [...this.value];
          this.value.forEach((id) => {
            const t = this.cascaderList[this.cascaderList.length - 1].list.find((_it) => _it[this.defaultProps.ID] === id);
            if (t && t[this.defaultProps.children]) {
              const list = t[this.defaultProps.children];
              if (list.length > 0) {
                if (typeof this.level !== 'number' || this.cascaderList.length < this.level) {
                  this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
                }
              }
            }
          });
          // 此处处理left值的变化
          this.handleLeftChange();
        }
      }
    },
    onItemHover(index, it) {
      if (this.activeIds[index] === it[this.defaultProps.ID]) {
        this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
        return;
      }
      this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
      this.cascaderList.splice(index + 1);
      const t = this.cascaderList[this.cascaderList.length - 1].list.find((_it) => _it[this.defaultProps.ID] === it[this.defaultProps.ID]);
      if (t && t[this.defaultProps.children]) {
        const list = t[this.defaultProps.children];
        if (list.length > 0) {
          if (typeof this.level !== 'number' || this.cascaderList.length < this.level) {
            this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
          }
        }
        // 此处处理left值的变化
        this.handleLeftChange();
      } else if (it[this.defaultProps.ID] === '' && this.withEmpty) {
        this.handleLeftChange();
      }
    },
    onItemClick(i) {
      if (this.onlyLastValid && i < this.cascaderList.length - 1) return;
      let _val = [...this.activeIds];
      if (_val.length === 1 && _val[0] === '') _val = [];
      if (JSON.stringify(_val) === JSON.stringify(this.value)) {
        this.close();
        return;
      }
      this.$emit('input', _val);
      this.$emit('change', _val);
      this.close();
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    handleResizeEventBind() {
      window.addEventListener('resize', this.onresize);
    },
    handleResizeEventRemove() {
      window.removeEventListener('resize', this.onresize);
    },
  },
  watch: {
    list() {
      this.setInitState();
    },
  },
  mounted() {
    this.onresize = debounce(this.getInitialLeft, 50);
    this.handleResizeEventBind();
  },
  beforeDestroy() {
    this.handleResizeEventRemove();
  },
  activated() {
    this.handleResizeEventBind();
  },
  deactivated() {
    this.handleResizeEventRemove();
  },

};
</script>

<style lang="scss">
</style>
