import {render} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Search from './components/search';
import Filter from './components/filter';
import Statistic from './components/statistic';

import BoardController from './controllers/board';
import SearchController from './controllers/search';

import data from './data';

const ID = {
  TASK: `control__task`,
  STATISTIC: `control__statistic`,
  NEW_TASK: `control__new-task`
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

const siteMain = document.querySelector(`.main`);
const siteControl = siteMain.querySelector(`.main__control`);

let taskMocks = data.taskList;

const mainMenu = new Menu(data.menu);
const search = new Search(data.search);
const statistic = new Statistic();
const onDataChange = (tasks) => {
  taskMocks = tasks;
};


render(siteControl, mainMenu.getElement(), Position.BEFOREEND);
render(siteMain, search.getElement(), Position.BEFOREEND);
renderFilter(siteMain, data.filter, data.taskList);
render(siteMain, statistic.getElement(), Position.BEFOREEND);


const boardController = new BoardController(siteMain, onDataChange);

const onSearchBackButtonClick = () => {
  statistic.getElement().classList.add(`visually-hidden`);
  searchController.hide();
  boardController.show(taskMocks);
};

const searchController = new SearchController(siteMain, search, onSearchBackButtonClick);

boardController.show(taskMocks);

mainMenu.getElement().addEventListener(`change`, (e) => {
  e.preventDefault();

  if (e.target.tagName !== `INPUT`) {
    return;
  }

  switch (e.target.id) {
    case ID.TASK:
      boardController.show(taskMocks);
      searchController.hide();
      statistic.getElement().classList.add(`visually-hidden`);
      break;

    case ID.STATISTIC:
      boardController.hide();
      searchController.hide();
      statistic.getElement().classList.remove(`visually-hidden`);
      break;

    case ID.NEW_TASK:
      searchController.hide();
      statistic.getElement().classList.add(`visually-hidden`);
      boardController.show(taskMocks);
      boardController.createTask();

      // Вернем выделенный элемент
      mainMenu.getElement().querySelector(`#${ID.TASK}`).checked = true;
      break;
  }

});

search.getElement().addEventListener(`click`, () => {
  statistic.getElement().classList.add(`visually-hidden`);
  boardController.hide();
  searchController.show(taskMocks);
});
