import {render} from '../utils';
import {unrender} from '../utils';
import {Position} from '../utils';

import Task from '../components/task';
import TaskEdit from '../components/task-edit';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
};

class TaskController {
  constructor(container, task, mode, onDataChange, onChangeView) {
    this._container = container;
    this._task = task;
    this._mode = mode;
    this._taskView = new Task(task);
    this._taskEdit = new TaskEdit(task);
    // this._taskEdit = null;
    this._currentView = this._taskView;
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.create();
  }

  create() {

    let renderPosition = Position.BEFOREEND;

    if (this._mode === Mode.ADDING) {
      renderPosition = Position.AFTERBEGIN;
      this._currentView = this._taskEdit;
      this._taskEdit.initFlatpickr();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    }

    this._subscribeOnViewEvents();
    this._subscribeOnEditEvents();
    render(this._container, this._currentView.getElement(), renderPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._replaceEditWithView();
    }
  }

  removeCreatingTask() {
    if (this._mode === Mode.ADDING) {
      unrender(this._currentView.getElement());
      this._currentView.removeElement();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _createTaskView() {
    this._taskView = new Task(this._task);
    this._subscribeOnViewEvents();
  }

  _removeTaskView() {
    this._taskView.removeElement();
    this._taskView = null;
  }

  _createTaskEdit() {
    this._taskEdit = new TaskEdit(this._task);
    this._subscribeOnEditEvents();
  }

  _removeTaskEdit() {
    this._taskEdit.destroyFlatpickr();
    this._taskEdit.removeElement();
    this._taskEdit = null;
  }

  _replaceEditWithView() {
    this._container.replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._removeTaskEdit();
    this._createTaskEdit();
  }

  _replaceViewWithEdit() {
    this._container.replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (evt.target !== this._taskEdit.getElement().querySelector(`.card__text`)) {

        switch (this._mode) {
          case Mode.DEFAULT:
            this._replaceEditWithView();
            break;

          case Mode.ADDING:
            this._onChangeView();
            break;
        }
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

  _updateProperty(prop, cb) {
    let entry = Object.assign({}, this._task);
    entry[prop] = cb();
    this._onDataChange(entry, this._task, false);
    this._task = entry;

    let oldTaskView = this._taskView.getElement();
    this._removeTaskView();
    this._createTaskView();

    this._container.replaceChild(this._taskView.getElement(), oldTaskView);
    oldTaskView = null;

    this._removeTaskEdit();
    this._createTaskEdit();

    entry = null;
  }

  _subscribeOnViewEvents() {
    this._taskView.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._onChangeView();
        this._replaceViewWithEdit();
        this._taskEdit.initFlatpickr();
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, (e) => {
        this._updateProperty(`isArchive`, this._onButtonClick.bind(null, e));
      });

    this._taskView.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, (e) => {
        this._updateProperty(`isFavorite`, this._onButtonClick.bind(null, e));
      });
  }

  _subscribeOnEditEvents() {
    if (!this._taskEdit) {
      return;
    }

    let isArchive = this._task.isArchive;
    this._taskEdit.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, (e) => {
        isArchive = this._onButtonClick(e);
      });

    let isFavorite = this._task.isFavorite;
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
      this.setDefaultView();

      this._onDataChange(entry, this._mode === Mode.DEFAULT ? this._task : null);
    });

    this._taskEdit.getElement()
      .querySelector(`.card__delete`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        if (this._mode === Mode.DEFAULT) {
          this._onDataChange(null, this._task);
          unrender(this._taskView.getElement());
          this._removeTaskView();
          unrender(this._taskEdit.getElement());
          this._removeTaskEdit();
          document.removeEventListener(`keydown`, this._onEscKeyDown);
        } else if (this._mode === Mode.ADDING) {
          this._onChangeView();
        }
      });
  }

}

export default TaskController;
