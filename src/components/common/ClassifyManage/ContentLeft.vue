<template>
  <section class="mp-erp-product-classify-manage-page-left-content-wrap">
    <header>
      <p class="mp-common-title-wrap">{{title}}分类</p>
    </header>
    <main>
      <p>
        <el-button class="cancel-blue-btn" @click="onItemClassifyManageClick('root')">管理根分类</el-button>
      </p>
      <div class="sort-wrap">
        <p class="sort-title">
          <span>分类名称</span>
          <span>管理</span>
        </p>
        <draggable class="sort-content" :class="editable?'canMove':''" v-bind="dragOptions" v-model="dataList" v-if="dataList.length > 0 && openList.length > 0"
           @end="onWrapMovEnd" :group='{name: "wrap", pull: false}'>
          <div class="sort-item" v-for="(item, index) in dataList" :key='item.ID' :class="openList[index] ? 'show' : 'hidden'"> <!-- 1级分类子项 -->
            <div class="item-title" @click.self="onActiveItemClick(item.ID)" :class="activeItemID === item.ID ? 'active' : ''"> <!-- 顶部标题 -->
              <span>{{item.ClassName}}</span> <!-- 分类名称 -->
              <div> <!-- 右侧折叠按钮 及 管理子类方法 -->
                <span :title="item.ClassName" @click="onItemClassifyManageClick(index)"><i class="el-icon-s-tools"></i>管理子类</span>
                <div @click="onArrowClick(index, item.children.length > 0)"><i v-if="item.children.length > 0" class="el-icon-arrow-right"></i></div>
              </div>
            </div>
            <draggable class="item-content" :class="editable?'canMove':''" v-bind="dragOptions"
            :group='{name: "menu", put: true}' v-model="item.children"> <!-- 折叠区域 -->
              <span
              @click="onActiveItemClick(child.ID)"
              :class="activeItemID === child.ID ? 'active' : ''"
                v-for="child in item.children"
              :key="child.ID"
              >
                {{child.ClassName}}
              </span>
            </draggable>
          </div>
        </draggable>
        <div v-if='classifyData.length === 0' class="non-data">暂无分类数据，快去添加吧</div>
      </div>
    </main>
    <footer>
      <template v-if="!editable">
        <el-button type='primary' @click="onSortClick" :disabled='classifyData.length === 0'>排序</el-button>
      </template>
      <template v-else>
        <el-button type='primary' @click="onSubmitClick">保存</el-button>
        <el-button class="cancel-blue-btn" @click="onCancelClick">取消</el-button>
      </template>
    </footer>
  </section>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  props: {
    classifyData: {
      type: Array,
      default: () => ([]),
    },
    title: {
      type: String,
      default: '产品',
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      dataList: [],
      activeItemID: null,
      openList: [],
      editable: false,
      recordOpenList: [],
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.editable,
        ghostClass: 'ghost',
      };
    },
  },
  methods: {
    onActiveItemClick(ID) {
      this.activeItemID = ID;
    },
    onArrowClick(i, bool) {
      if (!bool) return;
      const t = this.openList[i] === 0 ? 1 : 0;
      this.openList.splice(i, 1, t);
    },
    onItemClassifyManageClick(i) {
      if (this.editable) return;
      const _data = i === 'root' ? this.classifyData : this.classifyData[i].children;
      const ParentID = i === 'root' ? -1 : this.classifyData[i].ID;
      const classifyName = i === 'root' ? '根分类' : this.classifyData[i].ClassName;
      this.$emit('setCurEditClassifyData', [_data, ParentID, classifyName]);
    },
    onWrapMovEnd({ oldIndex, newIndex }) {
      const tempArr = this.openList.splice(oldIndex, 1);
      this.openList.splice(newIndex, 0, tempArr[0]);
    },
    onSortClick() {
      this.editable = true;
      this.recordOpenList = JSON.parse(JSON.stringify(this.openList));
    },
    onCancelClick() {
      this.dataList = JSON.parse(JSON.stringify(this.classifyData));
      this.openList = this.recordOpenList;
      this.editable = false;
    },
    async onSubmitClick() {
      const _list = this.dataList.map((it, i) => ({ ...it, Index: i }));
      this.dataList.forEach(lv1 => {
        if (lv1.children.length > 0) {
          const _tempList = lv1.children.map((it, i) => ({ ...it, Index: i, ParentID: lv1.ID }));
          _list.push(..._tempList);
        }
      });
      const resp = await this.api.getClassOrder(_list).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          this.$emit('submit', _list);
          this.editable = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  watch: {
    classifyData: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.dataList = JSON.parse(JSON.stringify(newVal));
          this.openList = newVal.map(() => 1);
        } else {
          this.dataList = [];
          this.openList = [];
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-classify-manage-page-left-content-wrap {
  > main {
    > p {
      padding: 20px 0;
    }
    > div.sort-wrap {
      height: calc(100% - 70px);
      > p.sort-title {
        height: 36px;
        background-color: rgb(245, 245, 245);
        display: flex;
        align-items: center;
        justify-content: space-between;
        > span {
          padding-left: 25px;
          padding-right: 100px;
          font-size: 14px;
          color: #444;
          font-weight: 700;
          white-space: nowrap;
        }
      }
      .sort-content {
        height: calc(100% - 36px);
        overflow: auto;
        .sort-item {
          color: #585858;
          font-size: 14px;
          > div.item-title {
            height: 39px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #eee;
            overflow: hidden;
            user-select: none;
            > span {
              padding:0 40px;
              white-space: nowrap;
            }
            > div {
              white-space: nowrap;
              color: #989898;
              display: flex;
              align-items: center;
              > span {
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                height: 36px;
                > i {
                  color: #26bcf9;
                  font-size: 16px;
                  font-weight: 700;
                  margin-right: 6px;
                }
                transition: color 0.2s ease-in-out;
                &:hover {
                  color: #444;
                }
                &:active {
                  color: #000;
                }
              }
              > div {
                margin: 0 25px 0 10px;
                height: 32px;
                width: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                > i {
                  font-size: 16px;
                  color: #888;
                  transition: transform 0.05s ease-in-out;
                }
                &:hover > i {
                  color: #000;
                }
              }
            }
            &:hover {
              background-color: #f6f6f6;
            }
            &.active {
              background-color: #eee;
              border-color: rgba(0, 0, 0, 0);
            }
          }
          > .item-content {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            > span {
              line-height: 20px;
              padding: 5px 0;
              height: 30px;
              box-sizing: border-box;
              padding-left: 70px;
              white-space: nowrap;
              &:hover {
                background-color: #f6f6f6;
              }
              &.active {
                background-color: #eee;
              }
            }
          }
          &:first-of-type > div.item-title {
            border: none;
          }
          &.hidden {
            > div.item-title {
              > div > div > i {
                transform: rotate(0deg);
              }
            }
            > .item-content {
              height: 0;
            }
          }
          &.show {
            > div.item-title {
              > div > div > i {
                transform: rotate(90deg);
              }
            }
            > .item-content {
              height: 100%;
            }
          }
        }
      }
    }
    .ghost {
      background: linear-gradient(to bottom, #fff calc(100% - 2px), #428dfa calc(100% - 2px), #428dfa 100%) !important;
    }
    .ghost .item-title {
      background-color: rgba(0, 0, 0, 0) !important;
    }
    .canMove.item-content > span:hover, .canMove .sort-item:hover, .canMove .sort-item .item-title > div > span:hover {
      cursor: move !important;
    }
    .canMove .sort-item .item-title > div > span:hover {
      color: #989898 !important;
    }
    .flip-list-move {
      transition: transform 0.5s;
    }
    .non-data {
      font-size: 12px;
      color: #a2a2a2;
      text-align: center;
      padding-top: 30px;
    }
  }
}
</style>
