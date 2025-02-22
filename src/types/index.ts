export type CategoryType =
	| 'софт-скил'
	| 'хард-скил'
	| 'дополнительное'
	| 'другое'
	| 'кнопка';

//товар
export interface IProduct {
    id?: string;
    title: string;
    price: number | null;
    description?: string;
    category: CategoryType;
    image: string;
	buttonName: string;
}

// Карточка продукта
export interface IProductCard {
	price: number | null;
	category: CategoryType;
	image: string;
	title: string;
	description: string;
	buttonName: string;
}

// Состояние приложения
export interface IApplicationState {
	itemList: IProduct[];
	basket: IProduct[];
	isBasketEmpty(): boolean;
	initializeItems(items: IProduct[]): void;
	totalPrice(): number;
	addBasket(item: IProduct): void;
	removeBasket(item: IProduct): void;
	prepareOrder(): void;
	clearBasket(): void;
	getItemsInBasket(): IProduct[];
	findBasketItemIndex(item: IProduct): number;
	setPayment(method: string): void;
	setAddress(address: string): void;
	setPreviewItem(item: IProduct): void;
	setOrderField(
		field: keyof Pick<
			IOrderDetails,
			'address' | 'phone' | 'email'
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
	payment: string;
	address: string;
	addPayment?(value: HTMLElement): void;
	removePayment?(): void;
}

// Контактная информация
export interface IContactDetails {
	email: string;
	phone: string;
	valid?: boolean;
	errors?: string;
}

// Заказ
export interface IOrderDetails extends IDeliveryDetails, IContactDetails {}

// Ошибки валидации формы
export type IFormValidationErrors = Partial<
	Record<keyof IOrderDetails, string>
>;

// Корзина
export interface IBasket {
	products: HTMLElement[];
	totalCost: number;
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
	Click: () => void;
}

// Главная страница
export interface IHomePage {
	productCatalog: HTMLElement[];
	itemCount: number;
	locked: boolean;
}

// Ответ от сервера после создания заказа
export interface IOrderResponse {
	orderId: string;
	orderTotal: number;
	Click?: () => void; 
}

// Модальное окно
export interface IModal {
	content: HTMLElement;
	renderContent(data: IModalContent): HTMLElement;
	open(): void;
	close(): void;
}

export type IModalContent = Pick<IModal, 'content'>;
