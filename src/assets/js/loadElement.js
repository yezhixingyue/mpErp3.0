import Vue from 'vue';

import {
  Pagination,
  Button,
  Popover,
  Dialog,
  Scrollbar,
  Menu,
  MenuItem,
  Submenu,
  Tabs,
  TabPane,
  Input,
  Form,
  FormItem,
  Dropdown,
  DropdownItem,
  Tooltip,
  DropdownMenu,
  Table,
  TableColumn,
  Radio,
  RadioGroup,
  RadioButton,
  Empty,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
} from 'element-ui';

// 指令
import Clickoutside from 'element-ui/lib/utils/clickoutside';

import { Button as MpButton } from 'mpzj-sell-lib';

Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(ButtonGroup);
Vue.use(Empty);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Pagination);
Vue.use(Button);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Scrollbar);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Tooltip);
Vue.use(Table);
Vue.use(TableColumn);

Vue.component('MpButton', MpButton);

Vue.directive('clickoutside', Clickoutside);
