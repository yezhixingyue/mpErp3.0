import Vue from 'vue';

import {
  Pagination,
  Button,
  Popover,
  Dialog,
  Scrollbar,
  // Table,
  // TableColumn,
} from 'element-ui';

// 指令
import Clickoutside from 'element-ui/lib/utils/clickoutside';

Vue.use(Pagination);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Scrollbar);
// Vue.use(Table);
// Vue.use(TableColumn);

// import ElementUI from 'element-ui';

// Vue.use(ElementUI);

Vue.directive('clickoutside', Clickoutside);
