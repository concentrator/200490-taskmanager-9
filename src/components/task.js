import {renderMuliply} from '../utils';

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

const createTaskTagTemplate = (name) => {
  return `
  <span class="card__hashtag-inner">
    <span class="card__hashtag-name">
      #${name}
    </span>
  </span>`;
};

const createTaskTagsList = (tags) => {
  let list = ``;
  tags.forEach((name) => {
    list += createTaskTagTemplate(name);
    return list;
  });
  return `<div class="card__hashtag-list">${list}\n</div>`;
};

const taskParams = {
  color: `black`,
  text: ``,
  date: ``,
  time: ``,
  tags: [],
  repeating: false,
  deadline: false
};

const createTaskTemplate = ({color, text, date, time, tags, repeating, deadline}) => {
  const tagsList = createTaskTagsList(tags);
  return `
  <article class="card card--${color}${repeating ? ` card--repeat` : ``}${deadline ? ` card--deadline` : ``}">
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
          <p class="card__text">${text}</p>
        </div>

        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                  <span class="card__time">${time}</span>
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

export const renderTasksList = (count) => {
  count = (TASKS.length < count) ? TASKS.length : count;
  const limitedTasks = TASKS.slice(0, count);
  const tasksWrapper = document.querySelector(`.board__tasks`);
  renderMuliply(tasksWrapper, `beforeend`, createTaskTemplate, taskParams, limitedTasks);
};
