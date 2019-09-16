import TaskController, {Mode} from './task.js';


class TaskListController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChangeMain = onDataChange;

    this._creatingTask = null;
    this._subscriptions = [];
    this._tasks = [];

    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];
    this._container.getElement().innerHTML = ``;
    this._renderTaskList();
  }

  addTasks(tasks) {
    this._renderTaskList(tasks);
    this._tasks = this._tasks.concat(tasks);
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    this._onChangeView();

    const defaultTask = {
      description: ``,
      dueDate: Date.now(),
      tags: new Set(),
      color: ``,
      repeatingDays: {},
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask =
      new TaskController(this._container, defaultTask, Mode.ADDING, this._onDataChange, this._onChangeView);

    this._subscriptions.unshift(this._creatingTask.setDefaultView.bind(this._creatingTask));
  }

  _removeCreatingTask() {
    this._creatingTask.removeCreatingTask();
    this._creatingTask = null;
  }

  _renderTask(task) {
    const taskController = new TaskController(this._container, task, Mode.DEFAULT, this._onDataChange, this._onChangeView);
    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onChangeView() {
    if (this._creatingTask) {
      this._subscriptions.splice(0, 1);
      this._removeCreatingTask();
    }
    this._subscriptions.forEach((it) => it());
  }

  _onDataChange(newData, oldData, renderList = true) {
    const index = this._tasks.indexOf(oldData);
    if (newData === null) {
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
    } else if (oldData === null) {
      this._removeCreatingTask();
      this._tasks = [newData, ...this._tasks];
    } else {
      this._tasks[index] = newData;
    }

    if (renderList) {
      // this.setTasks(this._tasks);
      this._onDataChangeMain(this._tasks);
    }
  }

  _renderTaskList(tasks = this._tasks) {
    tasks.forEach((task) => {
      this._renderTask(task);
    });
  }
}

export default TaskListController;
