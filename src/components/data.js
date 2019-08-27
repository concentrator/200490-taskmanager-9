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
  dueDate: Date.now() + 1 + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
  // dueDate: new Date(),
  repeatingDays: {
    'Mo': false,
    'Tu': false,
    'We': getRandomBoolean(),
    'Th': false,
    'Fr': getRandomBoolean(),
    'Sa': false,
    'Su': false,
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
  isFavorite: getRandomBoolean(),
  isArchive: getRandomBoolean()
});

const getTaskList = (count) => Array.from(new Array(count), () => getTask());

const taskList = getTaskList(33);

const data = {
  menu: MenuItems,
  search: searchItem,
  filter: FilterItems,
  sort: SortItems,
  taskList
};

export default data;
