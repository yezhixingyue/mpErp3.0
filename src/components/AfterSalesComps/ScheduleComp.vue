<template>
  <section class="schedule-wrap">
    <header class="is-bold">
      {{title}}：
    </header>
    <ul v-if="Progresses">
      <li v-for="(item, i) in Progresses" :key="item.CreateTime + i">
        <img src="@/assets/images/动线剪头.png" alt="">
        <p :class="{'is-pink': item.ConfirmType === 0}" >{{item[defaultKey.Time] | formatDate}}</p>
        <p :class="{'is-pink': item.ConfirmType === 0}" :title="item[defaultKey.Content]">{{item[defaultKey.Content]}}</p>
        <p v-if="item[defaultKey.Title]">
          <el-popover
            placement="top"
            @show="() => show(i)"
            @hide="() => hide(i)"
            width="240"
            trigger="click">
            <div style="max-height: 100px; overflow-y: auto">
              <p style="display: flex;">
                <span class="is-gray">
                  {{getServiceType(item.ServiceType)}}原因：
                  </span><span style="flex: 1;">{{ item[defaultKey.Title] }}
                </span>
              </p>
              <p style="background-color: #E6E6E6;height: 1px;margin: 4px 0;"></p>
              <p style="display: flex;">
                <span class="is-gray">备注：</span><span style="flex: 1;">{{ item[defaultKey.Remark] }}</span>
              </p>
            </div>
            <span slot="reference">{{lists.findIndex(it => it === i) === -1 ? '查看' : '隐藏'}}原因</span>
          </el-popover>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '服务进度',
    },
    Progresses: {
      type: Array,
      default: () => ([]),
    },
    defaultKey: {
      type: Object,
      default: () => ({
        Time: 'CreateTime',
        Content: 'ServiceContent',
        Title: 'ReasonTypeTitle',
        Remark: 'OperaterRemark',
      }),
    },
  },
  components: {},
  data() {
    return {
      nowDate: null,
      lists: [],
    };
  },
  computed: {},
  methods: {
    getServiceType(ServiceType) {
      let msg = '';
      switch (ServiceType) {
        case 1:
          msg = '挂起';
          break;
        case 3:
          msg = '转他人';
          break;
        default:
          break;
      }
      return msg;
    },
    show(index) {
      this.lists.push(index);
    },
    hide(index) {
      this.lists = this.lists.filter(it => it !== index);
    },
  },
  mounted() {},
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.schedule-wrap{
  padding-left: 20px;
  font-size: 12px;
  >header{
    margin: 10px 0 10px 0;
  }
  >ul{
    padding: 16px 5px 15px 5px;
    background-color: #F4FBFF;
    border-radius: 4px;
    display: flex;
    overflow-x: auto;
    max-width: 953px;
    >li+li{
      margin-left: 10px;
    }
    >li{
      width: 124px;
      text-align: center;
      line-height: 16px;
      padding: 0 10px;
      box-sizing: border-box;
      position: relative;
      &:first-of-type{
        >img{
          display: none;
        }
      }
      &:last-of-type{
        >img{
          filter: grayscale(0%);
        }
      }
      >img{
        position: absolute;
        left: -10px;
        top: 16px;
        filter: grayscale(100%);
      }
      >p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        >span{
          color: #26BCF9;
        }
      }
    }
  }
}
</style>
