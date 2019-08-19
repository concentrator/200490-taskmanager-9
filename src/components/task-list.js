import {makeTask} from './task';
import {makeTaskEditForm} from './task-edit';

const makeTaskList = (taskList, count, begin, initial) => {
  const end = begin + count;
  const tasks = taskList.slice(begin, end);
  const list = [];

  tasks.forEach((task, index) => {
    if (initial && index === 0) {
      list.push(makeTaskEditForm(task));
    } else {
      list.push(makeTask(task));
    }

  });
  return list.join(``);
};


export const renderTasks = (container, taskList, count, begin, initial = false) => {
  container.insertAdjacentHTML(`beforeend`, makeTaskList(taskList, count, begin, initial));
};

