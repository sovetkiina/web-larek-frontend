export type CategoryType =
	| 'soft-skill'
	| 'hard-skill'
	| 'additional'
	| 'other'
	| 'button';

//товар
export interface IProduct {
    id?: string;
    name: string;
    price: number | null;
    description?: string;
    category: CategoryType;
    image: string;
}

// Карточка продукта
export interface IProductCard {
	price: number | null;
	type: CategoryType;
	image: string;
	name: string;
	description: string;
	buttonName: string;
}

// Состояние приложения
export interface IApplicationState {
	itemList: IProduct[];
	cart: IProduct[];
	isCartEmpty(): boolean;
	initializeItems(items: IProduct[]): void;
	calculateTotalPrice(): number;
	addToCart(item: IProduct): void;
	removeFromCart(item: IProduct): void;
	submitOrder(): void;
	clearCart(): void;
	getItemsInCart(): IProduct[];
	findCartItemIndex(item: IProduct): number;
	updatePaymentMethod(method: string): void;
	updateDeliveryAddress(address: string): void;
	setPreviewItem(item: IProduct): void;
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
