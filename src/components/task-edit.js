import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

import {getFormattedDate} from '../utils';
import {unrender} from '../utils';

import AbstractComponent from './abstract-component';

const COLORS = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`,
];

class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, tags, color, repeatingDays, isArchive, isFavorite}) {
    super();
    this._description = description;
    this._dueDate = dueDate;
    this._calendar = null;
    this._tags = tags;
    this._tagElements = null;
    this._color = color ? color : `black`;
    this._repeatingDays = repeatingDays;
    this._isRepeating = this._isRepeating();
    this._isArchive = isArchive;
    this._isFavorite = isFavorite;
    this._subscribeOnEvents();
  }

  initFlatpickr() {
    this._calendar =
    flatpickr(this.getElement().querySelector(`.card__date`), {
      altFormat: `j F`,
      altInput: true,
      allowInput: true,
      minDate: Math.min(this._dueDate, Date.now()),
      defaultDate: this._dueDate ? this._dueDate : new Date(),
    });
  }

  destroyFlatpickr() {
    if (this._calendar) {
      this._calendar.destroy();
    }
  }

  _isRepeating() {
    return Object.values(this._repeatingDays).some((day) => day);
  }

  _onDateButtonClick(e) {
    e.preventDefault();
    const dateElement = this.getElement().querySelector(`.card__date-deadline`);
    const dateStatus = e.currentTarget.querySelector(`.card__date-status`);
    const dateInput = dateElement.querySelector(`input[name="date"]`);

    if (dateElement.hidden) {
      dateElement.hidden = false;
      dateStatus.textContent = `Yes`;
      this.initFlatpickr();

    } else {
      dateElement.hidden = true;
      dateStatus.textContent = `No`;
      dateInput.value = ``;
      this.destroyFlatpickr();
    }
  }

  _onRepeatButtonClick(e) {
    const status = e.currentTarget.querySelector(`.card__repeat-status`);
    e.preventDefault();
    const repeatDaysElement = this.getElement().querySelector(`.card__repeat-days`);
    if (!repeatDaysElement.hidden) {
      const inputs = repeatDaysElement.querySelectorAll(`.card__repeat-day-input`);
      inputs.forEach((input) => {
        input.checked = false;
      });
      repeatDaysElement.hidden = true;
      this._isRepeating = false;
      this.getElement().classList.remove(`card--repeat`);
      status.textContent = `No`;
    } else {
      repeatDaysElement.hidden = false;
      this._isRepeating = true;
      this.getElement().classList.add(`card--repeat`);
      status.textContent = `Yes`;
    }
  }

  _onColorClick(e) {
    if (e.target.nodeName === `LABEL`) {
      let color = e.target.textContent.trim();
      let className = this.getElement().className.trim();
      this.getElement().className = className.replace(this._color, color);
      this._color = color;
    }
  }

  _onHashTagEnter(evt) {
    if (evt.key === `Enter`) {
      evt.preventDefault();
      this.getElement().querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, `<span class="card__hashtag-inner">
      <input
        type="hidden"
        name="hashtag"
        value="${evt.target.value}"
        class="card__hashtag-hidden-input"
      />
      <p class="card__hashtag-name">
        #${evt.target.value}
      </p>
      <button type="button" class="card__hashtag-delete">
        delete
      </button>
    </span>`);
      evt.target.value = ``;
      this._tagElements[this._tagElements.length - 1].querySelector(`.card__hashtag-delete`)
        .addEventListener(`click`, (e) => {
          this._onTagDeleteClick(e);
        });
    }
  }

  _onTagDeleteClick(e) {
    e.preventDefault();
    unrender(e.target.parentElement);
  }

  _subscribeOnEvents() {
    this.getElement().querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, (e) => this._onDateButtonClick(e));

    this.getElement().querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, (e) => this._onRepeatButtonClick(e));

    this.getElement().querySelector(`.card__colors-wrap`)
      .addEventListener(`click`, (e) => this._onColorClick(e));

    this._tagElements = this.getElement().querySelector(`.card__hashtag-list`).children;
    Array.from(this._tagElements).forEach((tag) => {
      tag.querySelector(`.card__hashtag-delete`).addEventListener(`click`, (e) => {
        this._onTagDeleteClick(e);
      });
    });

    this.getElement()
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`keydown`, (evt) => {
        this._onHashTagEnter(evt);
      });
  }

  _getRepeatDaysTemplate() {
    return `
    <div class="card__repeat-days-inner">
      ${Object.keys(this._repeatingDays).map((day) => (`
      <input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-4"
        name="repeat"
        value="${day}"
        ${this._repeatingDays[day] ? `checked` : ``}/>
      <label class="card__repeat-day" for="repeat-${day}-4">
        ${day}
      </label>`)).join(``)}
    </div>`;
  }

  getTemplate() {
    return `
    <article class="card card--edit card--${this._color} ${this._isRepeating ? `card--repeat` : ``}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button"
              class="card__btn card__btn--archive ${!this._isArchive ? `card__btn--disabled` : ``}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${!this._isFavorite ? `card__btn--disabled` : ``}">
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">
                  ${this._dueDate ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline" ${!this._dueDate ? `hidden` : ``}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder=""
                      name="date"
                      value="${getFormattedDate(this._dueDate)}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">
                    ${this._isRepeating ? `yes` : `no`}
                  </span>
                </button>

                <fieldset class="card__repeat-days" ${!this._isRepeating ? `hidden` : ``}>
                ${this._getRepeatDaysTemplate()}
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                ${Array.from(this._tags).map((tag) => (`
                  <span class="card__hashtag-inner">
                    <input
                      type="hidden"
                      name="hashtag"
                      value="${tag}"
                      class="card__hashtag-hidden-input"
                    />
                    <span class="card__hashtag-name">
                      #${tag}
                    </span>
                    <button type="button" class="card__hashtag-delete">
                      delete
                    </button>
                  </span>`.trim())).join(``)}
                </div>
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
              ${COLORS.map((color) => (`
                <input
                  type="radio"
                  id="color-${color}-4"
                  class="card__color-input card__color-input--${color} visually-hidden"
                  name="color"
                  value="${color}"
                  ${this._color === color ? `checked` : ``}
                />
                <label
                  for="color-${color}-4"
                  class="card__color card__color--${color}">
                  ${color}
                </label>`)).join(``)}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`.trim();
  }
}

export default TaskEdit;
