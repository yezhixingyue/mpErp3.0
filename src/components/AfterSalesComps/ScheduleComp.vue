<template>
  <section class="schedule-wrap">
    <header class="is-bold">
      服务进度：
    </header>
    <ul v-if="Progresses">
      <li v-for="(item, i) in Progresses" :key="item.CreateTime + i">
        <img src="@/assets/images/动线剪头.png" alt="">
        <p>{{item[defaultKey.Time] | formatDate}}</p>
        <p :title="item[defaultKey.Content]">{{item[defaultKey.Content]}}</p>
        <p v-if="item[defaultKey.Title]">
          <el-popover
            placement="top"
            :title="item[defaultKey.Title]"
            width="200"
            trigger="click"
            :content="item[defaultKey.Remark]">
            <span slot="reference">查看原因</span>
          </el-popover>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>

export default {
  props: {
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
    };
  },
  computed: {},
  methods: {},
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
