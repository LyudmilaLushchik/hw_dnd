export default class Storage {
  constructor(storage) {
    this.storage = storage;
  }

  save(data) {
    this.storage.setItem('taskManager', JSON.stringify(data));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('taskManager'));
    } catch (e) {
      throw new Error('Invalid object');
    }
  }
}
