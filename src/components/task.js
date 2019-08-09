import {renderMuliply} from '../utils';

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

export const renderTasksList = (tasks, count) => {
  let tasksToRender = (count && count < tasks.length) ? tasks.slice(0, count) : tasks;
  const tasksWrapper = document.querySelector(`.board__tasks`);
  renderMuliply(tasksWrapper, `beforeend`, createTaskTemplate, taskParams, tasksToRender);
};
