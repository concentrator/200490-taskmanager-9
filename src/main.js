import {render} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Search from './components/search';
import Filter from './components/filter';
import Statistic from './components/statistic';

import BoardController from './controllers/board';

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


const mainMenu = new Menu(data.menu);
const search = new Search(data.search);
const statistic = new Statistic();


render(siteControl, mainMenu.getElement(), Position.BEFOREEND);
render(siteMain, search.getElement(), Position.BEFOREEND);
renderFilter(siteMain, data.filter, data.taskList);
render(siteMain, statistic.getElement(), Position.BEFOREEND);


const boardController = new BoardController(siteMain, data.taskList);

boardController.init();

mainMenu.getElement().addEventListener(`change`, (e) => {
  e.preventDefault();

  if (e.target.tagName !== `INPUT`) {
    return;
  }

  switch (e.target.id) {
    case ID.TASK:
      boardController.show();
      statistic.getElement().classList.add(`visually-hidden`);
      break;

    case ID.STATISTIC:
      boardController.hide();
      statistic.getElement().classList.remove(`visually-hidden`);
      break;

    case ID.NEW_TASK:
      boardController.createTask();
      // Вернем выделенный элемент
      mainMenu.getElement().querySelector(`#${ID.TASK}`).checked = true;
      break;
  }

});
