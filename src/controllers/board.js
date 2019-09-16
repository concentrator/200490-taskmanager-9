import {render, unrender, Position} from '../utils';

import Board from '../components/board';
import Sort from '../components/sort';
import TaskList from '../components/task-list';
import Message from '../components/message';
import Button from '../components/button';

import TaskController from './task';

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

const TASKS_TO_LOAD = 8;

class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks.slice().sort((a, b) => b.id - a.id);
    this._tasksCount = TASKS_TO_LOAD;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sort = new Sort();
    this._button = new Button();
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
  }

  init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    render(this._board.getElement(), this._taskList.getElement(), Position.AFTERBEGIN);

    if (this._taskList.length === 0 || this._isAllArchive()) {

      const message = new Message(`no-tasks`);
      render(this._board.getElement(), message.getElement(), Position.AFTERBEGIN);
      unrender(this._taskList.getElement());

    } else {

      render(this._board.getElement(), this._button.getElement(), Position.BEFOREEND);
      this._button.getElement().addEventListener(`click`, (e) => this._onMoreButtonClick(e));

      this._renderSort();
      this._renderTaskList();
    }
  }

  show() {
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
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
      new TaskController(this._taskList, defaultTask, Mode.ADDING, this._onDataChange, this._onChangeView);

    this._subscriptions.unshift(this._creatingTask.setDefaultView.bind(this._creatingTask));
  }

  _removeCreatingTask() {
    this._creatingTask.removeCreatingTask();
    this._creatingTask = null;
  }

  _renderSort() {
    this._sort.getElement().addEventListener(`click`, (e) => this._onSortLinkClick(e));
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
  }

  _onMoreButtonClick(e) {
    e.preventDefault();
    this._tasksCount = this._taskList.getElement().childElementCount;
    const tasksLeft = this._tasks.length - this._tasksCount;

    this._onChangeView();

    this._renderTaskList(this._tasks, this._tasksCount, TASKS_TO_LOAD);
    this._tasksCount += TASKS_TO_LOAD;

    if (tasksLeft < TASKS_TO_LOAD) {
      unrender(this._button.getElement());
    }
  }

  _onSortLinkClick(e) {

    e.preventDefault();
    if (e.target.nodeName !== `A`) {
      return;
    }
    this._onChangeView();
    this._subscriptions = [];
    this._taskList.getElement().innerHTML = ``;

    switch (e.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.sort((a, b) => a.dueDate - b.dueDate);
        this._renderTaskList(sortedByDateUpTasks, 0, this._tasksCount);
        break;

      case `date-down`:
        const sortedByDateDownTasks = this._tasks.sort((a, b) => b.dueDate - a.dueDate);
        this._renderTaskList(sortedByDateDownTasks, 0, this._tasksCount);
        break;

      case `default`:
        const sortedByDefaultTasks = this._tasks.sort((a, b) => b.id - a.id);
        this._renderTaskList(sortedByDefaultTasks, 0, this._tasksCount);
        break;
    }
  }

  _isAllArchive() {
    return this._tasks.filter((task) => task.isArchive).length === this._tasks.length;
  }

  _renderTask(task) {
    const taskController = new TaskController(this._taskList, task, Mode.DEFAULT, this._onDataChange, this._onChangeView);
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
      this._subscriptions = [];
      this._taskList.getElement().innerHTML = ``;
      this._renderTaskList();
    }
  }

  _renderTaskList(tasks = this._tasks, startIndex = 0, count = this._tasksCount) {
    const endIndex = startIndex + count;
    const tasksToRender = tasks.slice(startIndex, endIndex);

    tasksToRender.forEach((task) => {
      this._renderTask(task);
    });
  }
}


export default BoardController;
