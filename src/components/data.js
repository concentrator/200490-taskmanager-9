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
    id: `all`,
    count: 13,
    isChecked: true
  },
  {
    id: `overdue`,
    isDisabled: true
  },
  {
    id: `today`,
    isDisabled: true
  },
  {
    id: `favorites`,
    count: 1,
  },
  {
    id: `repeating`,
    count: 1,
  },
  {
    id: `tags`,
    count: 1,
  },
  {
    id: `archive`,
    count: 115,
  }
];

const SortItems = [
  {title: `DEFAULT`},
  {title: `DATE up`},
  {title: `DATE down`}
];

const Tasks = [
  {
    text: `Example default task with default color.`,
    date: `23 September`,
    time: `11:15 PM`,
    tags: [`todo`, `personal`, `important`]
  },
  {
    color: `blue`,
    text: `Example default task with custom color.`,
    date: `23 September`,
    time: `11:15 PM`,
    tags: [`todo`, `personal`, `important`]
  },
  {
    color: `yellow`,
    text: `Example default task with custom color and without date.`,
    tags: [`todo`, `personal`, `important`]
  },
  {
    color: `green`,
    text: `Example default task with custom color and without hashtags.`,
    date: `23 September`,
    time: `11:15 PM`,
  },
  {
    text: `Example default task without date and hashtags.`,
  },
  {
    color: `pink`,
    text: `It is example of repeating task. It marks by wave.`,
    date: `23 September`,
    time: `11:15 PM`,
    tags: [`todo`, `personal`, `important`],
    repeating: true
  },
  {
    text: `This is card with missing deadline.`,
    deadline: true
  },
  {
    text: `This is card with missing deadline. Deadline always marked by red line.`,
    date: `23 September`,
    time: `11:15 PM`,
    tags: [`todo`, `personal`, `important`],
    deadline: true
  },
];

const data = {
  menu: MenuItems,
  search: searchItem,
  filter: FilterItems,
  sort: SortItems,
  tasks: Tasks
};

export default data;
