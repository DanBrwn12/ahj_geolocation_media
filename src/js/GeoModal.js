import parseCoords from './parseCoords';

export default class GeoModal {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.render();
    this.bindEvents();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.classList.add('modal', 'hidden');

    this.modalEl.innerHTML = `
      <div class="modal__content">
        <div class="modal__header">Что-то пошло не так</div>
        <div class="modal__body">
          <p class="modal__text">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
          <p class="modal__hint">Широта и долгота через запятую</p>
          <input type="text" class="modal__input" placeholder="51.50851, -0.12572">
          <div class="modal__error hidden">Неверный формат</div>
        </div>
        <div class="modal__footer">
          <button class="modal__cancel">Отмена</button>
          <button class="modal__ok">ОК</button>
        </div>
      </div>
    `;

    document.body.append(this.modalEl);

    this.input = this.modalEl.querySelector('.modal__input');
    this.errorEl = this.modalEl.querySelector('.modal__error');
    this.okBtn = this.modalEl.querySelector('.modal__ok');
    this.cancelBtn = this.modalEl.querySelector('.modal__cancel');
  }

  bindEvents() {
    this.okBtn.addEventListener('click', () => {
      try {
        const coords = parseCoords(this.input.value);
        this.hide();
        this.onSubmit(coords);
      } catch {
        this.errorEl.classList.remove('hidden');
        this.input.classList.add('invalid');
      }
    });

    this.cancelBtn.addEventListener('click', () => {
      this.hide();
    });
  }

  show() {
    this.modalEl.classList.remove('hidden');
    this.input.value = '';
    this.errorEl.classList.add('hidden');
    this.input.classList.remove('invalid');
  }

  hide() {
    this.modalEl.classList.add('hidden');
  }
}
