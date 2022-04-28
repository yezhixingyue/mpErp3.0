import Vue from 'vue';

import {
  Dialog, Table, CarouselItem, Image, Dropdown, DropdownMenu, DropdownItem, Select, Option, Drawer, Alert,
  TableColumn, DatePicker, Popover, Radio, Icon, Carousel, Progress, Tabs, TabPane, Message, Scrollbar, Col, Autocomplete,
  Tooltip, Pagination, Upload, Checkbox, RadioGroup, RadioButton, TimeSelect, CheckboxGroup, Tree, Menu, Submenu, MenuItem,
  TimePicker, Form, FormItem, Input, Button, Cascader, Collapse, CollapseItem, Switch, Divider, Loading, InputNumber, Notification, Rate,
} from 'element-ui';


Vue.use(Drawer);
Vue.use(Alert);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(DatePicker);
Vue.use(Dialog);
Vue.use(Popover);
Vue.use(Radio);
Vue.use(Icon);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(CarouselItem);
Vue.use(Image);
Vue.use(Carousel);
Vue.use(Progress);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tooltip);
Vue.use(Progress);
Vue.use(Pagination);
Vue.use(Upload);
Vue.use(Checkbox);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(TimeSelect);
Vue.use(CheckboxGroup);
Vue.use(Tree);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Cascader);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Switch);
Vue.use(Divider);
Vue.use(InputNumber);
Vue.use(Autocomplete);
Vue.use(Scrollbar);
Vue.use(Rate);

Vue.use(Loading.directive);

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

// Vue.use(Element);
