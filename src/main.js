import {render} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Search from './components/search';
import Filter from './components/filter';
import Sort from './components/sort';
import Board from './components/board';
import Task from './components/task';
import TaskEdit from './components/task-edit';
// import Button from './components/button';

import data from './components/data';

// const TASKS_TO_LOAD = 8;

const siteMain = document.querySelector(`.main`);
const siteControl = siteMain.querySelector(`.main__control`);

const renderMenu = (menuItems) => {
  const menu = new Menu(menuItems);
  render(siteControl, menu.getElement(), Position.BEFOREEND);
};

const renderSearch = (searchItem) => {
  const search = new Search(searchItem);
  render(siteMain, search.getElement(), Position.BEFOREEND);
};

const renderFilter = (filterItems, taskList) => {

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
  render(siteMain, filter.getElement(), Position.BEFOREEND);
};

const renderBoard = () => {
  const board = new Board();
  render(siteMain, board.getElement(), Position.BEFOREEND);
  return board;
};

const renderSort = (sortItems) => {
  const sort = new Sort(sortItems);
  render(siteBoard, sort.getElement(), Position.AFTERBEGIN);
};

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      tasksWrapper.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      tasksWrapper.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__form`)
    .addEventListener(`submit`, (e) => {
      e.preventDefault();
      tasksWrapper.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(tasksWrapper, task.getElement(), Position.BEFOREEND);
};

renderMenu(data.menu);
renderSearch(data.search);
renderFilter(data.filter, data.taskList);

const board = renderBoard();

const siteBoard = board.getElement();

renderSort(data.sort);

const tasksWrapper = siteBoard.querySelector(`.board__tasks`);

data.taskList.forEach((task) => renderTask(task));

// render(siteBoard, `beforeend`, createMoreButtonTemplate, `load more`);

// const getTasksCount = () => tasksWrapper.childElementCount;

// const loadMoreButton = siteMain.querySelector(`.load-more`);

// loadMoreButton.addEventListener(`click`, (e) => {
//   e.preventDefault();
//   const tasksCount = getTasksCount();
//   const tasksLeft = data.taskList.length - tasksCount;

//   renderTasks(tasksWrapper, data.taskList, TASKS_TO_LOAD, tasksCount);

//   if (tasksLeft < TASKS_TO_LOAD) {
//     loadMoreButton.style.display = `none`;
//   }
// });
