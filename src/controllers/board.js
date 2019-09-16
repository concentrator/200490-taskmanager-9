import {render, unrender, Position} from '../utils';

import Board from '../components/board';
import Sort from '../components/sort';
import TaskList from '../components/task-list';
import Message from '../components/message';
import Button from '../components/button';

import TaskListController from './task-list';

const TASKS_TO_LOAD = 8;

const SortMode = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`
};

class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._tasksCount = TASKS_TO_LOAD;
    this._board = new Board();
    this._taskList = new TaskList();
    this._sort = new Sort();
    this._button = new Button();
    this._sortMode = SortMode.DEFAULT;
    this._onDataChange = this._onDataChange.bind(this);
    this._taskListController = new TaskListController(this._taskList, this._onDataChange);
    this._init();
  }

  _init() {
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    this._renderSort();
  }

  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }
    this._board.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._board.getElement().classList.add(`visually-hidden`);
  }

  createTask() {
    if (!this._board.getElement().contains(this._taskList.getElement())) {
      render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
      this._removeMessage();
    }
    this._taskListController.createTask();
  }

  _renderBoard() {
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    unrender(this._button.getElement());
    this._button.removeElement();

    if (this._tasks.length === 0 || this._isAllArchive()) {
      unrender(this._taskList.getElement());
      this._taskList.removeElement();
      unrender(this._sort.getElement());
      this._sort.removeElement();
      this._message = new Message(`no-tasks`);
      render(this._board.getElement(), this._message.getElement(), Position.AFTERBEGIN);

      return;
    }

    this._removeMessage();

    if (this._tasksCount < this._tasks.length) {
      render(this._board.getElement(), this._button.getElement(), Position.BEFOREEND);
    }

    let tasks = this._tasks;

    if (this._sortMode !== SortMode.DEFAULT) {
      if (this._sortMode === SortMode.DATE_UP) {
        this._setSortedByDateUpTasks();
      } else if (this._sortMode === SortMode.DATE_DOWN) {
        this._setSortedByDateDownTasks();
      }
      tasks = this._sortedTasks;
    }

    this._taskListController.setTasks(tasks.slice(0, this._tasksCount));
    this._button.getElement().addEventListener(`click`, (e) => this._onMoreButtonClick(e));
  }

  _setTasks(tasks) {
    this._tasks = tasks.slice();
    this._tasksCount = TASKS_TO_LOAD;
    this._renderBoard();
  }

  _removeMessage() {
    if (this._message) {
      unrender(this._message.getElement());
      this._message.removeElement();
      this._message = null;
    }
  }

  _renderSort() {
    render(this._board.getElement(), this._sort.getElement(), Position.AFTERBEGIN);
    this._sort.getElement().addEventListener(`click`, (e) => this._onSortLinkClick(e));
  }

  _onMoreButtonClick(e) {
    e.preventDefault();
    const tasks = this._sortMode === SortMode.DEFAULT ? this._tasks : this._sortedTasks;

    this._taskListController.addTasks(tasks.slice(this._tasksCount, this._tasksCount + TASKS_TO_LOAD));

    this._tasksCount += TASKS_TO_LOAD;

    if (this._tasksCount >= this._tasks.length) {
      unrender(this._button.getElement());
      this._button.removeElement();
    }
  }

  _setSortedByDateUpTasks() {
    this._sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
  }

  _setSortedByDateDownTasks() {
    this._sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
  }

  _onSortLinkClick(e) {

    e.preventDefault();
    if (e.target.nodeName !== `A` || this._sortMode === e.target.dataset.sortType) {
      return;
    }

    this._sortMode = e.target.dataset.sortType;

    switch (this._sortMode) {
      case SortMode.DATE_UP:
        this._setSortedByDateUpTasks();
        this._taskListController.setTasks(this._sortedTasks.slice(0, this._tasksCount));
        break;

      case SortMode.DATE_DOWN:
        this._setSortedByDateDownTasks();
        this._taskListController.setTasks(this._sortedTasks.slice(0, this._tasksCount));
        break;

      case SortMode.DEFAULT:
        this._taskListController.setTasks(this._tasks.slice(0, this._tasksCount));
        break;
    }


  }

  _isAllArchive() {
    return this._tasks.filter((task) => task.isArchive).length === this._tasks.length;
  }

  _onDataChange(tasks) {
    // Переписываем видимую часть тасков
    this._tasks = [...tasks, ...this._tasks.slice(this._tasksCount)];

    this._renderBoard();
  }
}


export default BoardController;
