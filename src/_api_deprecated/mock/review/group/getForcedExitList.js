import Mock from 'mockjs';

export default () => {
  const temp = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumber: 50,
    VersionCode: 0,
    'Data|50': [{
      ID: '@rgba',
      Name: '@cname()',
      'List|1-8': [
        {
          'ID|+1': 0,
          Remark: '',
          Time: '@datetime("yyyy-MM-dd HH:mm:ss.000Z")',
          'GroupList|1-5': [
            {
              'ID|+1': 0,
              'Name|1': ['名片组', '画册组', '单张组'],
            },
          ],
        },
      ],
    }],
  });

  return temp;
};
