const getEnumList = EnumsObj => {
  const list = [];
  Object.keys(EnumsObj).forEach(key => {
    const { label, value } = EnumsObj[key];
    const temp = {
      ID: value,
      Name: label,
    };
    list.push(temp);
  });
  return list;
};

export default getEnumList;
