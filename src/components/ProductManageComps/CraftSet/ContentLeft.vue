<template>
  <section class="mp-erp-product-module-craft-set-page-left-content-wrap">
    <header>
      <span class="mp-common-title-wrap">单选工艺</span>
      <span class="blue-span" :class="usableCraftList && usableCraftList.length > 0 ? '' : 'disabled'" @click="onSingleCraftSaveClick(null)">+ 添加</span>
    </header>
    <main>
      <SingleSelectCraftSetDialog :usableCraftList='usableCraftList' :CraftConditionList='CraftConditionList' :visible.sync='visible' v-model="curEditData" />
      <ul v-if="usableCraftList && usableCraftList.length > 0 && CraftConditionList">
        <li v-for="it in CraftConditionList" :key="it.ID">
          <div class="names" :title="getSingleCraftNames(it.List)">{{getSingleCraftNames(it.List)}}</div>
          <div class="required">{{it.IsRequired?'必选':''}}</div>
          <div class="select">
            <template v-if="it.IsRequired">
              <span>初始选中：</span><span :title="getDefaultCraftName(it.DefaultCraft)">{{getDefaultCraftName(it.DefaultCraft)}}</span>
            </template>
          </div>
          <div class="ctrl">
            <span @click="onSingleCraftSaveClick(it)"><i></i> 编辑</span>
            <span class="del-btn" @click="onItemRemove(it)"><i></i> 删除</span>
          </div>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import SingleSelectCraftSetDialog from './SingleSelectCraftSetDialog.vue';

export default {
  props: {
    usableCraftList: {
      type: Array,
      default: null,
    },
    CraftConditionList: {
      type: Array,
      default: null,
    },
  },
  components: {
    SingleSelectCraftSetDialog,
  },
  data() {
    return {
      visible: false,
      singleCraftData: null,
    };
  },
  computed: {
    curEditData: {
      get() {
        return this.singleCraftData;
      },
      set(val) {
        this.$emit('submit', val);
      },
    },
  },
  methods: {
    onSingleCraftSaveClick(data) {
      this.singleCraftData = data;
      this.visible = true;
    },
    getSingleCraftNames(list) {
      if (!list || !Array.isArray(list) || list.length === 0
       || !this.usableCraftList || !Array.isArray(this.usableCraftList) || this.usableCraftList.length === 0) return '';
      const _list = list.map(it => this.usableCraftList.find(_it => _it.ID === it)).filter(it => it).map(it => it.Name);
      return _list.join('、');
    },
    getDefaultCraftName(ID) {
      if (!ID) return '未设置';
      const t = this.usableCraftList.find(_it => _it.ID === ID);
      return t ? t.Name : '';
    },
    onItemRemove(it) {
      this.messageBox.warnCancelBox('确定删除该单选工艺设置吗', `该设置共包含有${it.List.length}种工艺`, () => {
        this.$emit('remove', it);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-craft-set-page-left-content-wrap {
  > header {
    white-space: nowrap;
    > span {
      white-space: nowrap;
      &.blue-span {
        font-size: 13px;
        margin-left: 25px;
      }
      &.mp-common-title-wrap {
        color: #444;
      }
    }
  }
  > main {
    > ul {
      padding: 30px 0;
      padding-right: 7%;
      > li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 7px 15px;
        padding-right: 12px;
        min-width: 500px;
        > div {
          white-space: nowrap;
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          height: 28px;
          line-height: 28px;
          color: #585858;
          flex: none;
          &.names {
            min-width: 120px;
            flex: 1;
          }
          &.required {
            width: 108px;
            text-align: center;
          }
          &.select {
            width: 150px;
            > span:last-of-type {
              font-weight: 700;
            }
          }
          &.ctrl {
            font-size: 12px;
            user-select: none;
            color: #A2A2A2;
            width: 140px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            padding: 0 15px;
            span {
              font-size: 12px;
              user-select: none;
              display: flex;
              align-items: center;
              > i {
                display: inline-block;
                width: 14px;
                height: 28px;
                vertical-align: top;
                margin-right: 6px;
                background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
              }
              cursor: pointer;
              transition: color 0.05s ease-in-out;
              &:hover {
                color: #444 !important;
              }
              &.del-btn > i {
                background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
