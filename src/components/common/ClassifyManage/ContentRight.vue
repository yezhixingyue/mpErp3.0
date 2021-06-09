<template>
  <section class="mp-erp-product-classify-manage-page-right-content-wrap">
    <header>
      <p class="mp-common-title-wrap">{{classifyName}}</p>
    </header>
    <main>
      <ul>
        <li v-for="(it, i) in list" :key="it.key">
          <el-input v-model.trim="it.ClassName" placeholder="在此输入分类名称" maxlength="20" show-word-limit></el-input>
          <div class="menu-box">
            <span @click="onItemAddClick">
              <i></i>添加
            </span>
            <span v-if="it.children && it.children.length > 0" class="gray-item is-disabled">
              <i></i>删除
            </span>
            <span v-else @click="onItemDelClick(it, i)">
              <i></i>删除
            </span>
          </div>
        </li>
      </ul>
    </main>
    <footer>
      <el-button type='primary' @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick">＜＜ 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { getRandomRangeId, animateScroll } from '@/assets/js/utils/util';

export default {
  props: {
    dataList: {
      type: Array,
      default: () => ([]),
    },
    ParentID: { required: true },
    classifyName: { required: true },
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    onGoBackClick() {
      // this.$router.replace('/ProductManageList');
      this.$emit('goback');
    },
    onItemAddClick() {
      const item = { ClassName: '', key: getRandomRangeId(10), ParentID: this.ParentID };
      if (this.ParentID === -1) item.children = [];
      this.list.push(item);
      this.$nextTick(() => {
        const oWrap = document.querySelector('.mp-erp-product-classify-manage-page-right-content-wrap > main');
        animateScroll(oWrap.scrollTop, oWrap.scrollHeight, (num) => { oWrap.scrollTop = num; });
      });
    },
    onItemDelClick(item, i) {
      if (!item.ID) this.handleItemDel(i);
      else {
        this.messageBox.warnCancelBox('确定删除分类吗 ?', `分类名称：[ ${item.ClassName} ]`, () => this.handleItemDel(i), null);
      }
    },
    handleItemDel(index) {
      this.list.splice(index, 1);
    },
    onSubmitClick() {
      // console.log('onSubmitClick', this.list);
      const t = this.list.find(it => !it.ClassName);
      if (t) {
        this.messageBox.warnSingleError('请检查分类名称是否输入，或删除空项', null, null, '保存失败');
        return;
      }
      this.$emit('submit', this.list);
    },
  },
  watch: {
    dataList: {
      handler(newVal) {
        if (newVal && newVal.length > 0) this.list = newVal;
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-classify-manage-page-right-content-wrap {
  > main {
    > ul {
      padding-top: 10px;
      > li {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
        > .el-input {
          width: 320px;
          height: 30px;
          > input {
            border-top: none;
            border-left: none;
            border-right: none;
            height: inherit;
          }
        }
        > .menu-box {
          font-size: 13px;
          color: #aaa;
          line-height: 30px;
          height: 30px;
          margin-left: 85px;
          white-space: nowrap;
          > span {
            line-height: 30px;
            height: 30px;
            display: inline-block;
            cursor: pointer;
            user-select: none;
            > i {
              display: inline-block;
              vertical-align: top;
              width: 30px;
              height: 30px;
            }
            &:first-of-type {
              > i {
                background: url(../../../assets/images/add.png) no-repeat center center/13px 13px;
              }
              padding-right: 20px;
            }
            &:last-of-type {
              padding-left: 10px;
              box-sizing: border-box;
              border-left: 1px solid #eee;
              > i {
                background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              }
              &.gray-item > i {
                background: url(../../../assets/images/del-disabled.png) no-repeat center center/12px 16px;
              }
            }
            &:hover:not(.is-disabled) {
              color: #444;
            }
          }
        }
      }
    }
  }
}
</style>
