import { Component } from './base/Сomponent';
import { ensureElement } from '../utils/utils';
import { CategoryType, IProduct, IProductCard, ICardActions } from '../types';

const CategoryList: Map<string, string> = new Map([
	['хард-скил', 'card__category_hard'],
	['софт-скил', 'card__category_soft'],
	['дополнительное', 'card__category_additional'],
	['другое', 'card__category_other'],
	['кнопка', 'card__category_button'],
]);

export class ProductCard extends Component<IProduct> implements IProductCard {
	protected _category: HTMLElement | null;
	protected _title: HTMLElement;
	protected _text: HTMLElement | null;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement | null;
	protected _button: HTMLButtonElement | null;

	constructor(container: HTMLElement, operation?: ICardActions) {
		super(container);
		this._category = container.querySelector(`.card__category`);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._text = container.querySelector(`.card__text`);
		this._image = container.querySelector(`.card__image`);
		this._price = container.querySelector(`.card__price`);
		this._button = container.querySelector(`.card__button`);

		if (operation?.handleClick) {
			if (this._button) {
				this._button.addEventListener('click', operation.handleClick);
			} else {
				container.addEventListener('click', operation.handleClick);
			}
		}
	}

	set price(price: number | null) {
		if (price) {
			this.setText(this._price, `${price} синапсов`);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	set category(text: CategoryType) {
		if (!this._category) return;

		// Проверяем, есть ли такая категория в списке
		if (!CategoryList.has(text)) {
			text = 'другое'; //в категорию "другое" по умолчанию
		}
		// Получаем нужный класс из CategoryList
		const categoryClass = CategoryList.get(text) || 'card__category_other';

		// заменяем className, оставляя базовый класс + нужный класс категории
		this._category.className = `card__category ${categoryClass}`;

		// Устанавливаем текст категории
		this.setText(this._category, text);
	}

	set image(link: string) {
		this.setImage(this._image, link, this.title);
	}

	set title(title: string) {
		this.setText(this._title, title);
	}

	set description(text: string) {
		
		this.setText(this._text, text);
	}

	set buttonName(value: string) {
		this.setText(this._button, value);
	}
}

export class BasketItem extends ProductCard {
	protected _title: HTMLElement;
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, operation?: ICardActions) {
		super(container, operation);

		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
	}

	set index(index: number) {
		this.setText(this._index, index);
	}
}
