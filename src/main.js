import {render} from './utils';
import {Position} from './utils';

import Menu from './components/menu';
import Search from './components/search';
import Filter from './components/filter';

import BoardController from './controllers/board';

import data from './data';


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


const siteMain = document.querySelector(`.main`);
const siteControl = siteMain.querySelector(`.main__control`);


renderMenu(siteControl, data.menu);
renderSearch(siteMain, data.search);
renderFilter(siteMain, data.filter, data.taskList);


const board = new BoardController(siteMain, data.taskList);

board.init();
