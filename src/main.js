import {render} from './utils';
import {createSiteMenu} from './components/site-menu';
import {createSearch} from './components/search';
import {createFilter} from './components/filter';
import {createSort} from './components/sort';
import {createBoardTemplate} from './components/board';
import {createTaskEditTemplate} from './components/task-edit';
import {renderTasksList} from './components/task';
import {createMoreButtonTemplate} from './components/more-button';


const siteMain = document.querySelector(`.main`);
const siteControl = siteMain.querySelector(`.main__control`);

const siteMenu = createSiteMenu();
const search = createSearch();
const filter = createFilter();
const sort = createSort();

siteControl.appendChild(siteMenu);
siteMain.appendChild(search);
siteMain.appendChild(filter);

render(siteMain, `beforeend`, createBoardTemplate);
const siteBoard = siteMain.querySelector(`.board`);
const tasksWrapper = siteBoard.querySelector(`.board__tasks`);

siteBoard.insertBefore(sort, tasksWrapper);

render(tasksWrapper, `beforeend`, createTaskEditTemplate);
renderTasksList(3);

render(siteBoard, `beforeend`, createMoreButtonTemplate, `load more`);
