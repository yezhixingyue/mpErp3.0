<template>
  <div class="mp-erp-time-limit-list-page-content-wrap">
    <div class="empty" v-if="dataList.length === 0">暂无数据</div>
    <el-collapse v-else v-model="activeNames" class="mp-directory-list-wrap">
      <el-collapse-item v-for="(it, i) in dataList" :key="i" :name="i">
        <template slot="title">
          <span class="t">{{it.ProductClass.FirstLevelName}} - {{it.ProductClass.SecondLevelName}}</span>
          <span @click.stop="onAddClick(it)" v-if="Permission && Permission.PermissionList.PermissionProducePeriod.Obj.Setup" class="is-gray"><i></i>添加工期</span>
          <span style="font-size: 12px; font-weight: 400; color: #989898; margin-left: 80px">
            共 <em style="color: #585858; font-weight: 700; font-size: 13px">{{it.count}}</em> 条数据</span>
        </template>
        <ul>
          <li class="is-gray" v-if="it.List.length === 0">暂无数据</li>
          <template v-else>
            <li v-for="item in it.List" class="item" :key="item.ID">
              <el-tooltip placement="top-start" transition='none'
               v-if="item.ProductString.length >= 18" :content="item.ProductString">
                <div>{{item.ProductString}}</div>
              </el-tooltip>
              <div v-else>{{item.ProductString}}</div>
              <div>{{item.RecordCount}}条记录</div>
              <div v-if="Permission && Permission.PermissionList.PermissionProducePeriod.Obj.Setup">
                <span class="blue-span" @click="handleEditClick(item)">编辑</span>
                <span class="red-span" @click="handleDelClick(item, i)">删除</span>
              </div>
            </li>
          </template>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('timelimit', ['searchCondition', 'dataList', 'TimeLimitActiveNames']),
    ...mapState('common', ['Permission']),
    activeNames: {
      get() {
        return this.TimeLimitActiveNames;
      },
      set(val) {
        this.$store.commit('timelimit/setTimeLimitActiveNames', val);
      },
    },
  },
  methods: {
    onAddClick({ ProductClass }) {
      this.$store.commit('timelimit/setSetPageType', 'add');
      this.$store.commit('timelimit/setAddTimeLimitDataInit', ProductClass);
      this.$router.push('/timeLimitSet');
    },
    handleDelClick({ ID, ProductString }, index) {
      this.messageBox.warnCancelBox('确定删除该条设置吗', `产品名称：${ProductString}`, async () => {
        const res = await this.api.getProducePeriodRemove(ID);
        if (res.data.Status !== 1000) return;
        const _func = () => {
          this.$store.commit('timelimit/removeItemFromDataList', [ID, index]);
        };
        this.messageBox.successSingle('删除成功', () => _func(), () => _func());
      });
    },
    async handleEditClick({ ID }) {
      const res = await this.api.getProducePeriodDetail(ID);
      if (res.data.Status !== 1000) return;
      const _Data = res.data.Data;
      const _temp = { ..._Data.ProductClass, ..._Data };
      delete _temp.ProductClass;
      this.$store.commit('timelimit/setSetPageType', 'edit');
      this.$store.commit('timelimit/setAddTimeLimitDataInit', _temp);
      this.$router.push('/timeLimitSet');
    },
  },
  watch: {
    // dataList(newVal) {
    //   if (!newVal || this.activeNames.length >= newVal.length) return;
    //   const _len = newVal.length - this.activeNames.length;
    //   const _initNum = this.activeNames.length;
    //   for (let index = 0; index < _len; index += 1) {
    //     this.activeNames.push(_initNum + index);
    //   }
    // },
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-list-page-content-wrap {
  width: 1050px;
  font-size: 14px;
  > .empty {
    width: 100%;
    text-align: center;
    color: #989898;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
  .mp-directory-list-wrap {
    border: none;
    > div {
      margin-bottom: 30px;
      > div{
        border: none;
        .el-collapse-item__header {
          height: 40px;
          background-color: #f5f5f5;
          border: none;
          font-size: 15px;
          font-weight: 700;
          padding: 0 20px;
          color: #444;
          > span {
            line-height: 20px;
            &.t {
              width: 365px;
            }
            &.is-gray {
              font-size: 12px;
              user-select: none;
              font-weight: 400;
              display: inline-block;
              padding: 4px 10px;
              border-radius: 2px;
              > i {
                display: inline-block;
                width: 14px;
                height: 14px;
                background: url(../../../assets/images/add-blue.png) no-repeat center;
                vertical-align: -2px;
                margin-right: 8px;
              }
              &:hover {
                color: #444 !important;
              }
              &:active {
                background-color: #ddd;
              }
            }
          }
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 2px;
            background-color: #26bcf9;
          }
        }
        .el-collapse-item__content {
          padding: 0;
          > ul {
            padding-top: 3px;
            > li {
              &.is-gray {
                text-align: center;
                font-size: 12px;
                margin: 8px 0;
                user-select: none;
              }
              &.item {
                display: flex;
                transition: 0.2s;
                > div {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  &:first-of-type {
                    width: 316px;
                    margin-right: 22px;
                  }
                  &:nth-of-type(2) {
                    width: 267px;
                    user-select: none;
                  }
                  > span {
                    margin: 0 14px;
                    padding: 0 6px;
                    font-size: 12px;
                  }
                }
                &:hover {
                  background-color: #d8effc;
                }
              }
              height: 45px;
              padding: 10px 0 10px 60px;
              line-height: 25px;
              font-size: 13px;
              box-sizing: border-box;
              color: #5e6d82;
            }
          }
        }
      }
    }
  }
}
</style>
