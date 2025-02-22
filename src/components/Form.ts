import { Component } from './base/Сomponent';
import { IEvents } from './base/EventEmitter';
import { IFormStructure } from '../types';
import { ensureElement } from '../utils/utils';

export class Form<T> extends Component<IFormStructure<T>> {
	protected submitButtonElement: HTMLButtonElement;
	protected errorMessagesElement: HTMLElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);
		// Добавляем обработчик для всех полей формы
		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.inputChange(field, value);
		});
		// Получаем кнопку отправки и блокируем её
		this.submitButtonElement = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.submitButtonElement.disabled = true;

		// Элемент для вывода сообщений об ошибках
		this.errorMessagesElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);

		// Обработчик отправки формы
		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this.submitButtonElement.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this.errorMessagesElement, value);
	}

	protected inputChange(field: keyof T, value: string) {
		this.events.emit(`order:change`, { field, value });

		// Получаем список всех полей формы
		const inputs = this.container.querySelectorAll('input');

		// Проверяем, все ли поля заполнены
		const allFieldsValid = Array.from(inputs).every(
			(input) => input.value.trim() !== ''
		);

		// Устанавливаем валидность формы
		this.valid = allFieldsValid;
	}

	render(
		data: Partial<T> & Pick<IFormStructure<T>, 'errorMessages' | 'isValid'>
	) {
		const { errorMessages, isValid, ...inputs } = data;
		super.render({ errorMessages, isValid });
		Object.assign(this, inputs);
		return this.container;
	}

	resetForm() {
		const inputs = this.container.querySelectorAll('input');
		inputs.forEach((input) => (input.value = ''));
		this.errors = '';
		this.valid = false;
	}
}
