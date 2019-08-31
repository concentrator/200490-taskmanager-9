import {render} from './utils';
import {unrender} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Search from './components/search';
import Filter from './components/filter';
import Sort from './components/sort';
import Board from './components/board';
import Task from './components/task';
import TaskEdit from './components/task-edit';
import TaskList from './components/task-list';
import Message from './components/message';
import Button from './components/button';

import data from './components/data';

const TASKS_TO_LOAD = 8;

const renderMenu = (container, menuItems) => {
  const menu = new Menu(menuItems);
  render(container, menu.getElement(), Position.BEFOREEND);
};

const renderSearch = (container, searchItem) => {
  const search = new Search(searchItem);
  render(container, search.getElement(), Position.BEFOREEND);
};

const renderFilter = (container, filterItems, taskList) => {

  const tasksCount = {
    all: taskList.length,
    overdue: 0,
    today: 0,
    get favorites() {
      return taskList.filter((item) => item.isFavorite).length;
    },
    get repeating() {
      return taskList.filter((item) => Object.values(item.repeatingDays).some((day) => day === true)).length;
    },
    get tags() {
      return taskList.filter((item) => item.tags.size > 0).length;
    },
    get archive() {
      return taskList.filter((item) => item.isArchive).length;
    }
  };

  filterItems.forEach((item) => {
    item.count = tasksCount[item.title];
  });

  const filter = new Filter(filterItems);
  render(container, filter.getElement(), Position.BEFOREEND);
};

const renderSort = (container, sortItems) => {
  const sort = new Sort(sortItems);
  render(container, sort.getElement(), Position.AFTERBEGIN);
  return sort;
};

const renderBoard = (container) => {
  const board = new Board();
  render(container, board.getElement(), Position.BEFOREEND);
  return board;
};

const renderTasksWrapper = (container) => {
  const tasksWrapper = new TaskList();
  render(container, tasksWrapper.getElement(), Position.AFTERBEGIN);
  return tasksWrapper;
};

const renderTask = (container, taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      container.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      container.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__form`)
    .addEventListener(`submit`, (e) => {
      e.preventDefault();
      container.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__text`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__text`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  render(container, task.getElement(), Position.BEFOREEND);
};

const renderTaskList = (container, taskList, tasksToLoad, startIndex = 0) => {
  const endIndex = startIndex + tasksToLoad;
  const tasks = taskList.slice(startIndex, endIndex);

  tasks.forEach((task) => {
    renderTask(container, task);
  });
};

const renderButton = (container, tasksContainer, taskList, tasksToLoad) => {
  const button = new Button(`load more`);
  render(container, button.getElement(), Position.BEFOREEND);

  button.getElement()
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      const tasksCount = tasksContainer.childElementCount;
      const tasksLeft = taskList.length - tasksCount;

      renderTaskList(tasksContainer, taskList, tasksToLoad, tasksCount);

      if (tasksLeft < TASKS_TO_LOAD) {
        unrender(button.getElement());
      }
    });
  return button;
};

const isAllArchive = (taskList) => {
  return taskList.filter((task) => task.isArchive).length === taskList.length;
};

const initBoard = (taskList) => {

  const siteMain = document.querySelector(`.main`);
  const siteControl = siteMain.querySelector(`.main__control`);

  renderMenu(siteControl, data.menu);
  renderSearch(siteMain, data.search);
  renderFilter(siteMain, data.filter, data.taskList);

  const board = renderBoard(siteMain);
  const boardElement = board.getElement();

  const tasksWrapper = renderTasksWrapper(boardElement);
  const tasksWrapperElement = tasksWrapper.getElement();

  const tasksSort = renderSort(boardElement, data.sort);
  const tasksSortElement = tasksSort.getElement();

  if (taskList.length === 0 || isAllArchive(taskList)) {
    const message = new Message(`no-tasks`);
    render(boardElement, message.getElement(), Position.AFTERBEGIN);
    unrender(tasksSortElement);
    unrender(tasksWrapperElement);
    tasksSort.removeElement();

  } else {
    renderTaskList(tasksWrapperElement, taskList, TASKS_TO_LOAD);
    renderButton(boardElement, tasksWrapperElement, taskList, TASKS_TO_LOAD);
  }
};

initBoard(data.taskList);
