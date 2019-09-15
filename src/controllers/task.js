import {render} from '../utils';
import {unrender} from '../utils';
import {Position} from '../utils';

import Task from '../components/task';
import TaskEdit from '../components/task-edit';

class TaskController {
  constructor(container, task, onDataChange, onChangeView) {
    this._container = container;
    this._task = task;
    this._taskView = new Task(task);
    this._taskEdit = new TaskEdit(task);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.create();
  }

  create() {
    this._subscribeOnViewEvents();
    this._subscribeOnEditEvents();
    render(this._container.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

  setDefaultView() {
    if (this._taskEdit && this._container.getElement().contains(this._taskEdit.getElement())) {
      this._replaceEditWithView();
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
    this._taskEdit.destroy();
    this._taskEdit.removeElement();
    this._taskEdit = null;
  }

  _replaceEditWithView() {
    this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._removeTaskEdit();
    this._createTaskEdit();
  }

  _replaceViewWithEdit() {
    this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (evt.target !== this._taskEdit.getElement().querySelector(`.card__text`)) {
        this._replaceEditWithView();
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

    this._container.getElement().replaceChild(this._taskView.getElement(), oldTaskView);
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

      this._onDataChange(entry, this._task);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
      // this._task = entry;
      // this._removeTaskView();
      // this._createTaskView();

      // this.setDefaultView();

      // this._removeTaskEdit();
      // this._createTaskEdit();
    });

    this._taskEdit.getElement()
      .querySelector(`.card__delete`)
      .addEventListener(`click`, (e) => {
        e.preventDefault();
        this._onDataChange(null, this._task);
        unrender(this._taskView.getElement());
        this._taskView.removeElement();
        this._taskView = null;
        this._taskEdit.destroy();
        unrender(this._taskEdit.getElement());
        this._taskEdit.removeElement();
        this._taskEdit = null;

      });
  }

}

export default TaskController;
