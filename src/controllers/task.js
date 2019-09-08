import {render} from '../utils';
import {Position} from '../utils';

import Task from '../components/task';
import TaskEdit from '../components/task-edit';

class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._taskView = new Task(data);
    this._taskEdit = null;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.create();
  }

  _replaceEditWithView() {
    this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    this._taskEdit.destroy();
    this._taskEdit = null;
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (evt.target !== this._taskEdit.getElement().querySelector(`.card__text`)) {
        this._replaceEditWithView();
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }
    }
  }

  _onButtonClick(e) {
    if (e.currentTarget.classList.contains(`card__btn--disabled`)) {
      e.currentTarget.classList.remove(`card__btn--disabled`);
      return true;
    } else {
      e.currentTarget.classList.add(`card__btn--disabled`);
      return false;
    }
  }

  _subscribeOnViewEvents() {
    this._taskView.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      this._taskEdit = new TaskEdit(this._data);
      this._subscribeOnEditEvents();
      this._onChangeView();
      this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._taskView.getElement()
    .querySelector(`.card__btn--archive`)
    .addEventListener(`click`, (e) => {
      const entry = Object.assign({}, this._data);
      entry.isArchive = this._onButtonClick(e);
      this._onDataChange(entry, this._data);
      this._data = entry;
    });

    this._taskView.getElement()
    .querySelector(`.card__btn--favorites`)
    .addEventListener(`click`, (e) => {
      const entry = Object.assign({}, this._data);
      entry.isFavorite = this._onButtonClick(e);
      this._onDataChange(entry, this._data);
      this._data = entry;
    });
  }

  _subscribeOnEditEvents() {

    if (!this._taskEdit) {
      return;
    }

    let isArchive = this._data.isArchive;
    this._taskEdit.getElement()
    .querySelector(`.card__btn--archive`)
    .addEventListener(`click`, (e) => {
      isArchive = this._onButtonClick(e);
    });

    let isFavorite = this._data.isFavorite;
    this._taskEdit.getElement()
    .querySelector(`.card__btn--favorites`)
    .addEventListener(`click`, (e) => {
      isFavorite = this._onButtonClick(e);
    });

    const taskEditForm = this._taskEdit.getElement().querySelector(`.card__form`);
    taskEditForm.addEventListener(`submit`, (e) => {
      e.preventDefault();

      const formData = new FormData(taskEditForm);
      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: formData.get(`date`) ? Date.parse(formData.get(`date`)) : null,
        repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
          acc[it] = true;
          return acc;
        }, {
          'mo': false,
          'tu': false,
          'we': false,
          'th': false,
          'fr': false,
          'sa': false,
          'su': false,
        }),
        isArchive,
        isFavorite
      };

      this._onDataChange(entry, this._data);
      this._data = entry;

      this._taskView.removeElement();
      this._taskView = new Task(this._data);
      this._subscribeOnViewEvents();

      this._replaceEditWithView();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

  }

  setDefaultView() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    if (this._taskEdit && this._container.getElement().contains(this._taskEdit.getElement())) {
      this._replaceEditWithView();
    }
  }

  create() {
    this._subscribeOnViewEvents();

    render(this._container.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

}

export default TaskController;
