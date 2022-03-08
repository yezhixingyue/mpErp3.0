import restoreClassByOriginData from '../../utils/reduction';

export default class LogisticItem {
  ID = ''

  Name = ''

  Classify = ''

  Enable = false

  constructor(data) {
    restoreClassByOriginData(this, data);
  }
}
