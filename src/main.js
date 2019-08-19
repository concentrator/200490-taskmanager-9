import {render} from './utils';
import {createSiteMenu} from './components/site-menu';
import {createSearch} from './components/search';
import {renderFilter} from './components/filter';
import {createSort} from './components/sort';
import {createBoardTemplate} from './components/board';
import {renderTasks} from './components/task-list';
import {createMoreButtonTemplate} from './components/more-button';
import data from './components/data';

const TASKS_TO_LOAD = 8;

const siteMain = document.querySelector(`.main`);
const siteControl = siteMain.querySelector(`.main__control`);

const siteMenu = createSiteMenu(data.menu);
const search = createSearch(data.search);
const filter = renderFilter(data.filter, data.taskList);
const sort = createSort(data.sort);

siteControl.appendChild(siteMenu);
siteMain.appendChild(search);
siteMain.appendChild(filter);

render(siteMain, `beforeend`, createBoardTemplate);

const siteBoard = siteMain.querySelector(`.board`);
const tasksWrapper = siteBoard.querySelector(`.board__tasks`);

siteBoard.insertBefore(sort, tasksWrapper);

renderTasks(tasksWrapper, data.taskList, TASKS_TO_LOAD, 0, true);

render(siteBoard, `beforeend`, createMoreButtonTemplate, `load more`);

const getTasksCount = () => tasksWrapper.childElementCount;

const loadMoreButton = siteMain.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, (e) => {
  e.preventDefault();
  const tasksCount = getTasksCount();
  const tasksLeft = data.taskList.length - tasksCount;

  renderTasks(tasksWrapper, data.taskList, TASKS_TO_LOAD, tasksCount);

  if (tasksLeft < TASKS_TO_LOAD) {
    loadMoreButton.style.display = `none`;
  }
});
