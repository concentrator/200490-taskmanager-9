import {render} from '../utils';
import {Position} from '../utils';

import Task from '../components/task';
import TaskEdit from '../components/task-edit';

class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;
    this._taskView = new Task(data);
    this._taskEdit = new TaskEdit(data);
    this._onChangeView = onChangeView;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this.create();
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (evt.target !== this._taskEdit.getElement().querySelector(`.card__text`)) {
        this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, this._onEscKeyDown);
      }
    }
  }

  _addViewEventSubscribtion() {
    this._taskView.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, (e) => {
      e.preventDefault();
      this._onChangeView();
      this._container.getElement().replaceChild(this._taskEdit.getElement(), this._taskView.getElement());
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });
  }

  _addEditEventSubscribtion() {
    const taskEditForm = this._taskEdit.getElement().querySelector(`.card__form`);
    taskEditForm.addEventListener(`submit`, (e) => {
      e.preventDefault();

      const formData = new FormData(taskEditForm);
      const entry = {
        description: formData.get(`text`),
        color: formData.get(`color`),
        tags: new Set(formData.getAll(`hashtag`)),
        dueDate: Date.parse(formData.get(`date`)),
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
        })
      };

      this._onDataChange(entry, this._data);

      this._data = entry;

      this._taskView.removeElement();

      this._taskView = new Task(this._data);
      this._addViewEventSubscribtion();

      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());

      this._taskEdit.removeElement();

      this._taskEdit = new TaskEdit(this._data);
      this._addEditEventSubscribtion();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });
  }

  setDefaultView() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    if (this._container.getElement().contains(this._taskEdit.getElement())) {
      this._container.getElement().replaceChild(this._taskView.getElement(), this._taskEdit.getElement());
    }
  }

  create() {
    this._addViewEventSubscribtion();
    this._addEditEventSubscribtion();

    render(this._container.getElement(), this._taskView.getElement(), Position.BEFOREEND);
  }

}

export default TaskController;
