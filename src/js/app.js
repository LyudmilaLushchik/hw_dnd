import TaskManager from './TaskManager';
import Storage from './Storage';

const storage = new Storage(localStorage);
const taskManager = new TaskManager(storage);
taskManager.init();
