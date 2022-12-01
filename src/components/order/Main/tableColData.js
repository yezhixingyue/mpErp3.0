const arr = [
  {
    label: '电商单号',
    prop: 'OutPlate',
    width: '88px',
    minWidth: '',
    sortable: false,
    showOverflowTooltip: true,
    scope: null,
  },
  {
    label: '客户编号',
    prop: 'CustomerNo',
    width: '90px',
    minWidth: '',
    sortable: true,
    showOverflowTooltip: false,
  },
  {
    label: '客户',
    prop: 'CustomerName',
    width: '125px',
    minWidth: '',
    sortable: false,
    showOverflowTooltip: true,
  },
  {
    label: '产品名称',
    prop: 'ProductName',
    width: '125px',
    minWidth: '',
    sortable: false,
    showOverflowTooltip: true,
    // scope: (row) => <>{row.ProductName}</>,
  },
  {
    label: '数量',
    prop: '',
    width: '68px',
    minWidth: '',
    sortable: false,
    showOverflowTooltip: true,
    // scope: (row) => <>{row.ProductAmount}{row.Unit}{row.KindCount}款</>,
  },
];

export default arr;
