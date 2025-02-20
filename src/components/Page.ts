import { Component } from './base/Сomponent';
import { IHomePage } from '../types';
import { IEvents } from './base/EventEmitter';
import { ensureElement } from '../utils/utils';

export class Page extends Component<never> implements IHomePage {
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set productCatalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set itemCount(value: number) {
		this.setText(this._counter, String(value));
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
