'use strict';

const CONTAINER = {
  main: `main`,
  control: `control`,
  controlWrap: `control__btn-wrap`,
  searchWrap: `main__search search container`,
  filterWrap: `main__filter filter container`,
  boardWrap: `board container`,
  sortWrap: `board__filter-list`,
  tasksWrap: `board__tasks`
};

const MENU_ITEMS = [
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

const SEARCH = {
  placeholder: `START TYPING — SEARCH BY WORD, #HASHTAG OR DATE`,
  label: `Search`
};

const FILTER_ITEMS = [
  {
    id: `all`,
    count: 13,
    isChecked: true
  },
  {
    id: `overdue`,
    count: 0,
    isDisabled: true
  },
  {
    id: `today`,
    count: 0,
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

const SORT_ITEMS = [`DEFAULT`, `DATE up`, `DATE down`];

const TASKS = [
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

const getElement = (elementClass) => document.querySelector(`.${elementClass}`);

const renderWrapper = (elementType, classList) => {
  let wrapper = document.createElement(elementType);
  wrapper.className = classList;
  return wrapper;
};

const getMenuItem = (id, label, isChecked = false) => {
  return `
  <input
    type="radio"
    name="control"
    id="control__${id}"
    class="control__input visually-hidden"
    ${isChecked ? `checked` : ``}/>
  <label for="control__${id}" class="control__label control__label--${id}"
    >${label}</label>`;
};

const renderMenu = (data, wrapperClass) => {
  const wrapper = renderWrapper(`section`, wrapperClass);
  data.forEach((el) => {
    wrapper.insertAdjacentHTML(`beforeend`, getMenuItem(el.id, el.label, el.isChecked));
  });
  return wrapper;
};

const getSearchItem = (placeholder, label) => {
  return `
  <input
    type="text"
    id="search__input"
    class="search__input"
    placeholder="${placeholder}"
    />
  <label class="visually-hidden" for="search__input">${label}</label>`;
};

const renderSearch = (data, wrapperClassList) => {
  const wrapper = renderWrapper(`section`, wrapperClassList);
  wrapper.insertAdjacentHTML(`beforeend`, getSearchItem(data.placeholder, data.label));
  return wrapper;
};

const getFilterItem = (id, count, isChecked = false, isDisabled = false) => {
  let label = `${id.charAt(0).toUpperCase()}${id.slice(1)} `;
  return `
  <input
  type="radio"
  id="filter__${id}"
  class="filter__input visually-hidden"
  name="filter"
  ${isChecked ? `checked` : ``}
  ${isDisabled ? `disabled` : ``}/>
  <label for="filter__${id}" class="filter__label">${label}
    <span class="filter__${id}-count">${count}</span>
  </label>`;
};

const renderFilter = (data, wrapperClass) => {
  const wrapper = renderWrapper(`section`, wrapperClass);
  data.forEach((el) => {
    wrapper.insertAdjacentHTML(`beforeend`, getFilterItem(el.id, el.count, el.isChecked, el.isDisabled));
  });
  return wrapper;
};

const getSortItem = (title, url = `#`) => {
  return `<a href="${url}" class="board__filter">SORT BY ${title}</a> `;
};

const renderSort = (data, wrapperClass) => {
  const wrapper = renderWrapper(`div`, wrapperClass);
  data.forEach((el) => {
    wrapper.insertAdjacentHTML(`beforeend`, getSortItem(el));
  });
  return wrapper;
};

const getTaskHashTag = (name) => {
  return `
  <span class="card__hashtag-inner">
    <span class="card__hashtag-name">
      #${name}
    </span>
  </span>`;
};

const getTaskTagsList = (tags) => {
  let list = ``;
  tags.forEach((name) => {
    list += getTaskHashTag(name);
    return list;
  });
  return `<div class="card__hashtag-list">${list}\n</div>`;
};

const getTask = (params) => {
  const tagsList = getTaskTagsList(params.tags);
  return `
  <article class="card card--${params.color} ${params.repeating ? `card--repeat` : ``} ${params.deadline ? `card--deadline` : ``}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites card__btn--disabled"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <p class="card__text">${params.text}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${params.date}</span>
                  <span class="card__time">${params.time}</span>
                </p>
              </div>
            </div>

            <div class="card__hashtag">
              ${tagsList}
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`;
};

// Task default params
const taskParams = {
  color: `black`,
  text: ``,
  date: ``,
  time: ``,
  tags: [],
  repeating: false,
  deadline: false
};

const renderTasks = (data, wrapper, count) => {
  count = (data.length < count) ? data.length : count;
  for (let i = 0; i < count; i++) {
    const params = Object.assign({}, taskParams); // Object shallow copy
    Object.assign(params, data[i]); // Merge defaults and task data
    wrapper.insertAdjacentHTML(`beforeend`, getTask(params));
  }
};

const getTaskForm = () => {
  return `
  <article class="card card--edit card--black">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--archive">
            archive
          </button>
          <button
            type="button"
            class="card__btn card__btn--favorites card__btn--disabled"
          >
            favorites
          </button>
        </div>

        <div class="card__color-bar">
          <svg width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>

        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >This is example of new task, you can add picture, set date and time, add tags.</textarea>
          </label>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <button class="card__date-deadline-toggle" type="button">
                date: <span class="card__date-status">no</span>
              </button>

              <fieldset class="card__date-deadline" disabled>
                <label class="card__input-deadline-wrap">
                  <input
                    class="card__date"
                    type="text"
                    placeholder="23 September"
                    name="date"
                  />
                </label>
              </fieldset>

              <button class="card__repeat-toggle" type="button">
                repeat:<span class="card__repeat-status">no</span>
              </button>

              <fieldset class="card__repeat-days" disabled>
                <div class="card__repeat-days-inner">
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-mo-1"
                    name="repeat"
                    value="mo"
                  />
                  <label class="card__repeat-day" for="repeat-mo-1"
                    >mo</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-tu-1"
                    name="repeat"
                    value="tu"
                    checked
                  />
                  <label class="card__repeat-day" for="repeat-tu-1"
                    >tu</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-we-1"
                    name="repeat"
                    value="we"
                  />
                  <label class="card__repeat-day" for="repeat-we-1"
                    >we</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-th-1"
                    name="repeat"
                    value="th"
                  />
                  <label class="card__repeat-day" for="repeat-th-1"
                    >th</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-fr-1"
                    name="repeat"
                    value="fr"
                    checked
                  />
                  <label class="card__repeat-day" for="repeat-fr-1"
                    >fr</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    name="repeat"
                    value="sa"
                    id="repeat-sa-1"
                  />
                  <label class="card__repeat-day" for="repeat-sa-1"
                    >sa</label
                  >
                  <input
                    class="visually-hidden card__repeat-day-input"
                    type="checkbox"
                    id="repeat-su-1"
                    name="repeat"
                    value="su"
                    checked
                  />
                  <label class="card__repeat-day" for="repeat-su-1"
                    >su</label
                  >
                </div>
              </fieldset>
            </div>

            <div class="card__hashtag">
              <div class="card__hashtag-list"></div>

              <label>
                <input
                  type="text"
                  class="card__hashtag-input"
                  name="hashtag-input"
                  placeholder="Type new hashtag here"
                />
              </label>
            </div>
          </div>

          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              <input
                type="radio"
                id="color-black-1"
                class="card__color-input card__color-input--black visually-hidden"
                name="color"
                value="black"
                checked
              />
              <label
                for="color-black-1"
                class="card__color card__color--black"
                >black</label
              >
              <input
                type="radio"
                id="color-yellow-1"
                class="card__color-input card__color-input--yellow visually-hidden"
                name="color"
                value="yellow"
              />
              <label
                for="color-yellow-1"
                class="card__color card__color--yellow"
                >yellow</label
              >
              <input
                type="radio"
                id="color-blue-1"
                class="card__color-input card__color-input--blue visually-hidden"
                name="color"
                value="blue"
              />
              <label
                for="color-blue-1"
                class="card__color card__color--blue"
                >blue</label
              >
              <input
                type="radio"
                id="color-green-1"
                class="card__color-input card__color-input--green visually-hidden"
                name="color"
                value="green"
              />
              <label
                for="color-green-1"
                class="card__color card__color--green"
                >green</label
              >
              <input
                type="radio"
                id="color-pink-1"
                class="card__color-input card__color-input--pink visually-hidden"
                name="color"
                value="pink"
              />
              <label
                for="color-pink-1"
                class="card__color card__color--pink"
                >pink</label
              >
            </div>
          </div>
        </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
};

const getMoreButton = (title) => {
  return `<button class="load-more" type="button">${title}</button>`;
};

const appendComponent = (container, component) => container.appendChild(component);
const insertComponent = (container, markup) => container.insertAdjacentHTML(`beforeend`, markup);

const main = getElement(CONTAINER.main);
const control = getElement(CONTAINER.control);

const menu = renderMenu(MENU_ITEMS, CONTAINER.controlWrap);
const search = renderSearch(SEARCH, CONTAINER.searchWrap);
const filter = renderFilter(FILTER_ITEMS, CONTAINER.filterWrap);

const board = renderWrapper(`section`, CONTAINER.boardWrap);

const sort = renderSort(SORT_ITEMS, CONTAINER.sortWrap);

const tasksWrapper = renderWrapper(`div`, CONTAINER.tasksWrap);

const taskForm = getTaskForm();

insertComponent(tasksWrapper, taskForm);

renderTasks(TASKS, tasksWrapper, 3);

const moreButton = getMoreButton(`load more`);

appendComponent(control, menu);
appendComponent(main, search);
appendComponent(main, filter);

appendComponent(board, sort);
appendComponent(board, tasksWrapper);

insertComponent(board, moreButton);

appendComponent(main, board);
