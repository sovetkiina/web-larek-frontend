export type CategoryType =
	| 'soft-skill'
	| 'hard-skill'
	| 'additional'
	| 'other'
	| 'button';

// Продукт
export interface IItem {
	name: string;
	id?: string;
	type: CategoryType;
	info?: string;
	imageUrl: string;
	price: number | null;
	buttonName?: string;
}

// Карточка продукта
export interface IItemCard {
	price: number | null;
	type: CategoryType;
	imageUrl: string;
	name: string;
	info: string;
	buttonName: string;
}

// Состояние приложения
export interface IApplicationState {
	itemList: IItem[];
	cart: IItem[];
	isCartEmpty(): boolean;
	initializeItems(items: IItem[]): void;
	calculateTotalPrice(): number;
	addToCart(item: IItem): void;
	removeFromCart(item: IItem): void;
	submitOrder(): void;
	clearCart(): void;
	getItemsInCart(): IItem[];
	findCartItemIndex(item: IItem): number;
	updatePaymentMethod(method: string): void;
	updateDeliveryAddress(address: string): void;
	setPreviewItem(item: IItem): void;
	updateOrderField(
		field: keyof Pick<
			IOrderDetails,
			'deliveryAddress' | 'contactNumber' | 'email'
		>,
		value: string
	): void;
	validateOrder(): boolean;
}

// Форма
export interface IFormStructure<T> {
	errorMessages: string;
	isValid: boolean;
	renderForm(data: Partial<T> & IFormStructure<T>): void;
}

// Окно заказа
export interface IDeliveryDetails {
	paymentMethod: string;
	deliveryAddress: string;
	addPaymentOption(option: HTMLElement): void;
	removePaymentOption(): void;
}

// Контактная информация
export interface IContactInfo {
	email: string;
	contactNumber: string;
}

// Заказ
export interface IOrderDetails extends IDeliveryDetails, IContactInfo {}

// Ошибки валидации формы
export type IFormValidationErrors = Partial<
	Record<keyof IOrderDetails, string>
>;

// Корзина
export interface IStoreCart {
	items: HTMLElement[];
	totalPrice: number;
}

// Успешное оформление заказа
export interface IOrderSuccess {
	itemCount: number | string;
}

// Действия с карточкой
export interface ICardActions {
	handleClick(event: MouseEvent): void;
}

// Окно успешного заказа
export interface IConfirmationModalActions {
	close(): void;
}

// Главная страница
export interface IHomePage {
	productCatalog: HTMLElement[];
	itemCount: number;
	isLocked: boolean;
}

// Ответ от сервера после создания заказа
export interface IOrderResponse {
	orderId: string;
	orderTotal: number;
}

// Модальное окно
export interface IModal {
	content: HTMLElement;
	renderContent(data: IModalContent): HTMLElement;
	open(): void;
	close(): void;
}

export type IModalContent = Pick<IModal, 'content'>;
