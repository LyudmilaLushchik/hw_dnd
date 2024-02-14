import DragAndDrop from './DragAndDrop';

export default class TaskManager {
  constructor(storage) {
    this.storage = storage;
    this.draggingEl = null;
    this.ghostEl = null;
    this.draggingElWidth = null;
    this.draggingElHeight = null;
    this.elLeftPos = null;
    this.elTopPos = null;
    this.todo = document.getElementById('todo');
    this.progress = document.getElementById('progress');
    this.done = document.getElementById('done');
    this.taskContainer = document.querySelector('.task_container');
    this.todoList = [];
    this.progressList = [];
    this.doneList = [];
    this.taskList = {
      todo: [],
      progress: [],
      done: [],
    };
    this.addButtons = document.querySelectorAll('.input_add_btn');
    this.openFormButtons = document.querySelectorAll('.add_btn');
    this.resetButtons = document.querySelectorAll('.input_reset');
    this.draggingItems = document.querySelectorAll('.task_list');
  }

  init() {
    const archiveData = this.storage.load();
    if (archiveData) {
      for (const item of archiveData.todo) {
        this.drawItem(item, this.todo.querySelector('.task_list'));
      }

      for (const item of archiveData.progress) {
        this.drawItem(item, this.progress.querySelector('.task_list'));
      }

      for (const item of archiveData.done) {
        this.drawItem(item, this.done.querySelector('.task_list'));
      }
    }

    this.draggingItems.forEach((element) => {
      element.addEventListener('mousedown', (evt) => {
        evt.preventDefault();
        if (!evt.target.classList.contains('list_item')) {
          return;
        }
        this.draggingEl = evt.target;
        this.ghostEl = evt.target.cloneNode(true);

        const { top, left } = evt.target.getBoundingClientRect();
        this.elLeftPos = evt.pageX - left;
        this.elTopPos = evt.pageY - top;

        this.draggingElWidth = this.draggingEl.offsetWidth;
        this.draggingElHeight = this.draggingEl.offsetHeight;

        this.ghostEl.style.width = `${this.draggingElWidth}px`;

        this.ghostEl.classList.add('dragging');
        this.ghostEl.classList.add('none');

        document.querySelector('.task_list').appendChild(this.ghostEl);

        this.ghostEl.style.left = `${evt.pageX - this.elLeftPos}px`;
        this.ghostEl.style.top = `${evt.pageY - this.elTopPos}px`;

        this.ghostEl.style.height = `${this.draggingElHeight}px`;
        this.draggingEl.classList.add('dragging');
        evt.target.parentNode.insertBefore(this.ghostEl, evt.target.nextElementSibling);

        this.draggingEl.style.width = `${this.draggingElWidth}px`;
        this.draggingEl.style.height = `${this.draggingElHeight}px`;
      });
    });

    this.taskContainer.addEventListener('mousemove', (event) => {
      if (this.draggingEl) {
        event.preventDefault();
        DragAndDrop(event, this.ghostEl);
        this.draggingEl.style.left = `${event.pageX - this.elLeftPos}px`;
        this.draggingEl.style.top = `${event.pageY - this.elTopPos}px`;
      }
    });

    this.taskContainer.addEventListener('mouseup', (event) => {
      if (this.draggingEl) {
        DragAndDrop(event, this.draggingEl);
        this.ghostEl.parentNode.removeChild(this.ghostEl);
        this.draggingEl.classList.remove('dragging');
        this.draggingEl.style = '';
        this.ghostEl = null;
        this.draggingEl = null;
        this.saveData();
      }
    });

    this.openFormButtons.forEach((element) => {
      element.addEventListener('click', ((event) => {
        event.preventDefault();
        element.parentNode.querySelector('.input_container').classList.remove('none');
        element.classList.add('none');
      }));
    });

    this.addButtons.forEach((element) => {
      element.addEventListener('click', ((event) => {
        event.preventDefault();
        const newTask = element.parentNode.querySelector('.input_task').value;
        const targetColumn = element.closest('.column').querySelector('.task_list');
        this.drawItem(newTask, targetColumn);
        element.parentNode.classList.add('none');
        element.closest('.input_container').closest('.column').querySelector('.add_btn').classList.remove('none');
        // eslint-disable-next-line no-param-reassign
        element.parentNode.querySelector('.input_task').value = '';
        this.saveData();
      }));
    });

    this.resetButtons.forEach((element) => {
      element.addEventListener('click', ((event) => {
        event.preventDefault();
        // eslint-disable-next-line no-param-reassign
        element.parentNode.querySelector('.input_task').value = '';
        element.parentNode.classList.add('none');
        element.closest('.input_container').closest('.column').querySelector('.add_btn').classList.remove('none');
        this.saveData();
      }));
    });
  }

  drawItem(inputText, targetEl) {
    const item = document.createElement('li');
    item.classList.add('list_item');
    item.innerHTML = `${inputText}<span class="task_item_del">&#x2716;</span>`;
    targetEl.append(item);
    const itemDeletetBtn = item.querySelector('.task_item_del');

    itemDeletetBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.target.parentNode.remove();
      this.saveData();
    });
  }

  saveData() {
    this.todoList = this.todo.querySelectorAll('.list_item');
    this.progressList = this.progress.querySelectorAll('.list_item');
    this.doneList = this.done.querySelectorAll('.list_item');

    for (const item of this.todoList) {
      let tasktext = item.textContent;
      const deleteIndex = tasktext.indexOf('✖');
      tasktext = tasktext.slice(0, deleteIndex);
      this.taskList.todo.push(tasktext);
    }

    for (const item of this.progressList) {
      let tasktext = item.textContent;
      const deleteIndex = tasktext.indexOf('✖');
      tasktext = tasktext.slice(0, deleteIndex);
      this.taskList.progress.push(tasktext);
    }

    for (const item of this.doneList) {
      let tasktext = item.textContent;
      const deleteIndex = tasktext.indexOf('✖');
      tasktext = tasktext.slice(0, deleteIndex);
      this.taskList.done.push(tasktext);
    }
    this.storage.save(this.taskList);
    this.taskList = {
      todo: [],
      progress: [],
      done: [],
    };
  }
}
