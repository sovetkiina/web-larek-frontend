import { Component } from './base/Сomponent';
import { EventEmitter } from './base/EventEmitter';
import { IBasket } from '../types';
import { createElement, ensureElement } from '../utils/utils';

export class Basket extends Component<never> implements IBasket {
	protected basketItems: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected totalPrice: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.basketItems = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);
		this.totalPrice = this.container.querySelector('.basket__price')!;
		this.basketButton = this.container.querySelector('.basket__button')!;

		if (this.basketButton) {
			this.basketButton.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		this.products = [];
	}

	set products(products: HTMLElement[]) {
		if (products.length > 0) {
			this.basketItems.replaceChildren(...products);
			this.setDisabled(this.basketButton, false);
		} else {
			this.basketItems.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this.setDisabled(this.basketButton, true);
		}
	}

	set totalCost(cost: number) {
		this.setText(this.totalPrice, `${cost} синапсов`);
	}
}
