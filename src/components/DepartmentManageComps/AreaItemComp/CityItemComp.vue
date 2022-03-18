<template>
  <li>
    <p class="header" @dblclick="onExtendClick" @click="onActiveIDClick(item.ID)" :class="{active: activeId === item.ID}">
      <span>{{item.ClassName}}</span>
      <span class="menu" @dblclick.stop @click="onManageSubClick" :class="{moving: true}">
        <template v-if="item.Level < 3">
          <img src="@/assets/images/setup.png" alt="">
          <span>管理子部门</span>
        </template>
      </span>
      <i class="el-icon-arrow-right" :class="{extend: extend}" @dblclick.stop @click.stop="onExtendClick"></i>
    </p>
    <div v-if="tertiarySectorlList.length" class="countys" v-show="extend">
      <!-- {{tertiarySectorlList}} -->
      <span
      v-for="it in tertiarySectorlList"
      :key="it.ID" @click="onActiveIDClick(it.ID)"
      :class="{active: activeId === it.ID}">
        {{it.ClassName}}
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    activeId: {
      default: '',
    },
    departmentList: {
      type: Array,
    },
  },
  data() {
    return {
      extend: true,
    };
  },
  computed: {
    tertiarySectorlList() {
      console.log(this.departmentList.filter(item => item.ParentID === this.item.ID));
      return this.departmentList.filter(item => item.ParentID === this.item.ID);
    },
  },
  methods: {
    onExtendClick() {
      if (this.tertiarySectorlList.length === 0) {
        return;
      }
      this.extend = !this.extend;
    },
    onActiveIDClick(id) {
      this.$emit('active', id);
    },
    onManageSubClick() { // 管理子区域
      if (this.item.Level < 3 && !this.moving) {
        console.log(this.item.Level);
        this.$emit('subManage', this.item.ID);
      }
    },
  },
};
</script>
<style lang='scss' scope>
.menu{
  display: flex;
  justify-content: end;
  margin-right: 25px;
  &:hover {
          cursor: pointer;
          color: #585858;
        }
  span{
    margin-left: 11px;
  }
}

</style>
