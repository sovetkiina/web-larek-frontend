import { IEvents } from './base/EventEmitter';
import {
	IProduct,
	IApplicationState,
	IOrderDetails,
	IFormValidationErrors,
} from '../types';

export class DataStore implements IApplicationState {
	itemList: IProduct[];
	basket: IProduct[] = [];
	protected formErrors: IFormValidationErrors = {};
	protected preview: string | null;
	protected order: IOrderDetails = {
		payment: '',
		address: '',
		phone: '',
		email: '',
	};

	constructor(protected events: IEvents) {}

	notify(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}

	initializeItems(items: IProduct[]) {
		this.itemList = items;
		this.notify('items:create');
	}

	totalPrice() {
		let totalPrice = 0;
		this.basket.forEach((item) => (totalPrice += item.price));
		return totalPrice;
	}

	addBasket(product: IProduct) {
		if (!this.basket.some((item) => item.id === product.id)) {
			this.basket = [...this.basket, product];
			this.notify('basket:changed');
		} else {
			this.removeBasket(product);
		}
	}

	removeBasket(product: IProduct) {
		if (this.basket.some((item) => item.id === product.id)) {
			this.basket = this.basket.filter((item) => product.id !== item.id);
			this.notify('basket:changed');
		}
		return;
	}

	prepareOrder() {
		return {
			...this.order,
			total: this.totalPrice(),
			items: this.basket.map((el) => el.id),
		};
	}

	clearBasket() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
		};
		this.basket = [];
		this.notify('basket:changed');
	}

	isBasketEmpty(): boolean {
		return this.basket.length === 0;
	}

	getItemsInBasket(): IProduct[] {
		return this.basket;
	}

	findBasketItemIndex(product: IProduct): number {
		return this.basket.indexOf(product) + 1;
	}

	setPayment(value: string) {
		if (this.order.payment !== value) this.order.payment = value;
	}

	setAddress(value: string) {
		this.order.address = value;
	}

	setPreviewItem(product: IProduct) {
		this.preview = product.id;
		this.notify('preview:changed', product);
	}

	setOrderField(
		field: keyof Pick<IOrderDetails, 'address' | 'phone' | 'email'>,
		value: string
	) {
		this.order[field] = value;
		this.validateOrder();
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}
