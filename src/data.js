const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const MenuItems = [
  {
    id: `new-task`,
    label: `+ ADD NEW TASK`
  },
  {
    id: `task`,
    label: `TASKS`,
    isChecked: true
  },
  {
    id: `statistic`,
    label: `STATISTICS`
  },
];

const searchItem = {
  placeholder: `START TYPING — SEARCH BY WORD, #HASHTAG OR DATE`,
  label: `Search`
};

const FilterItems = [
  {
    title: `all`,
    isChecked: true
  },
  {
    title: `overdue`,
    isDisabled: true
  },
  {
    title: `today`,
    isDisabled: true
  },
  {
    title: `favorites`,
  },
  {
    title: `repeating`,
  },
  {
    title: `tags`,
  },
  {
    title: `archive`,
  }
];

const SortItems = [
  {title: `DEFAULT`},
  {title: `DATE up`},
  {title: `DATE down`}
];

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

const getTask = () => ({
  description: [
    `Изучить теорию`,
    `Сделать домашку`,
    `Пройти интенсив на соточку`,
  ][Math.floor(Math.random() * 3)],
  dueDate: new Date(Date.now() - ONE_DAY_MS + Math.floor(Math.random() * 7) * ONE_DAY_MS).toISOString(),
  repeatingDays: {
    'mo': false,
    'tu': false,
    'we': getRandomBoolean(),
    'th': false,
    'fr': getRandomBoolean(),
    'sa': false,
    'su': false,
  },
  tags: new Set(shuffleArray([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `personal`,
    `important`
  ]).slice(0, Math.floor(Math.random() * 4))),
  color: [
    `black`,
    `yellow`,
    `blue`,
    `green`,
    `pink`,
  ][Math.floor(Math.random() * 5)],
  isArchive: getRandomBoolean(),
  // isArchive: true
  isFavorite: getRandomBoolean(),
});

const getTaskList = (count) => {
  let i = 0;
  return Array.from(new Array(count), () => {
    const task = getTask();
    // task.createdDate = Date.now() + i++;
    task.dueDate = Date.parse(task.dueDate);
    task.id = i++;
    return task;
  });
};


const taskList = getTaskList(55);

// console.log(taskList)

const data = {
  menu: MenuItems,
  search: searchItem,
  filter: FilterItems,
  sort: SortItems,
  taskList
};

export default data;
