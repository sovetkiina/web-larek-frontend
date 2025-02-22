import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrderDetails } from './types';
import { EventEmitter } from './components/base/EventEmitter';
import { ApiAdapter } from './components/ApiAdapter';
import { DataStore } from './components/DataStore';
import { ProductCard, BasketItem } from './components/ProductCard';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { Modal } from './components/Modal';
import { DeliveryForm } from './components/DeliveryForm';
import { ContactForm } from './components/ContactForm';
import { TransactionSuccess } from './components/TransactionSuccess';

const api = new ApiAdapter(CDN_URL, API_URL);
const events = new EventEmitter();

// HTML-шаблоны
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const CatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const confirmationTemplate = ensureElement<HTMLTemplateElement>('#success');

//Модель данных
const appState = new DataStore(events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(orderTemplate), events);
const success = new TransactionSuccess(cloneTemplate(confirmationTemplate), {
	Click: () => {
		modal.close();
	},
});

//Запрос данных с сервера
api
	.getList()
	.then(appState.initializeItems.bind(appState))
	.catch((error) => {
		console.error(error);
	});

//Рендер товаров на стр
events.on('items:create', () => {
	page.productCatalog = appState.itemList.map((item) => {
		const cardTemplate = new ProductCard(cloneTemplate(CatalogTemplate), {
			handleClick: (event: MouseEvent) => {
				console.log('Card clicked:', item);
				events.emit('card:select', item);
			},
		});

		return cardTemplate.render({
			id: item.id,
			title: item.title,
			price: item.price,
			description: item.description,
			category: item.category,
			image: item.image,
		});
	});
});

// Отправить в превью карточку
events.on('card:select', (product: IProduct) => {
	console.log('Selected product:', product);
	appState.setPreviewItem(product);
});

// Открыть превью карточки товара
events.on('preview:changed', (product: IProduct) => {
	const card = new ProductCard(cloneTemplate(cardPreviewTemplate), {
		handleClick: () => {
			events.emit('product:add', product);
			events.emit('preview:changed', product);
		},
	});
	modal.renderContent({
		content: card.render({
			id: product.id,
			title: product.title,
			description: product.description,
			category: product.category,
			image: product.image,
			price: product.price,
			buttonName: appState.basket.map((el) => el.id).includes(product.id)
				? 'Уже в корзине'
				: 'В корзину',
		}),
	});
});

// Открыть корзину
events.on('basket:open', () => {
	console.log('basket.render():', basket.render());
	modal.renderContent({
		content: basket.render(),
	});
});

// Изменились товары в корзине
events.on('basket:changed', () => {
	page.itemCount = appState.getItemsInBasket().length;
	basket.products = appState.getItemsInBasket().map((product) => {
		const basketItem = new BasketItem(cloneTemplate(cardBasketTemplate), {
			handleClick: () => {
				events.emit('product:delete', product);
			},
		});

		basketItem.index = appState.findBasketItemIndex(product);

		return basketItem.render({
			title: product.title,
			price: product.price,
		});
	});
	basket.totalCost = appState.totalPrice();
});

//Добавить товар в корзину
events.on('product:add', (product: IProduct) => {
	appState.addBasket(product);
});

//Удалить товар из корзины
events.on('product:delete', (product: IProduct) => {
	appState.removeBasket(product);
});

// Модальное окно заказа
events.on('order:open', () => {
	delivery.resetForm();
	modal.render({
		content: delivery.render({
			address: '',
			payment: '',
			errorMessages: '',
			isValid: false,
		}),
	});

	delivery.removePayment();
});

// Модальное окно контактной информации
events.on('order:submit', () => {
	appState.prepareOrder().total = appState.totalPrice();
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			isValid: false,
			errorMessages: '',
		}),
	});
	contacts.valid = false;
});

// Запуск валидации
events.on('formErrors:change', (errors: Partial<IOrderDetails>) => {
	console.log('Errors:', errors);
	const { email, phone, address, payment } = errors;
	// Проверка валидности полей
	delivery.valid = !(address && !payment);
	contacts.valid = !(email && !phone);
	// Обновление ошибок
	delivery.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('. ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('. ');
});

// Выбор способа оплаты
events.on(
	'payment:change',
	(data: { payment: string; button: HTMLElement }) => {
		appState.setPayment(data.payment);
		delivery.addPayment(data.button);
		appState.validateOrder();
	}
);

// Изменение поля доставки
events.on(
	'order:change',
	(data: {
		field: keyof Pick<IOrderDetails, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);

// Изменение поля контактов
events.on(
	'contacts:change',
	(data: {
		field: keyof Pick<IOrderDetails, 'address' | 'phone' | 'email'>;
		value: string;
	}) => {
		appState.setOrderField(data.field, data.value);
	}
);

//Отправка контактной формы и отображение окна с подтверждением успешного заказа
events.on('contacts:submit', () => {
	api
		.sendOrder(appState.prepareOrder())
		.then((res) => {
			console.log(res);
			const totalCost = appState.totalPrice();
			success.count = totalCost;
			modal.renderContent({ content: success.render() });
			appState.clearBasket();
		})
		.catch((error) => {
			console.error('Ошибка при отправке заказа:', error);
			if (error.response) {
				console.error('Ответ от сервера:', error.response);
			} else if (error.request) {
				console.error('Запрос не был отправлен:', error.request);
			} else {
				console.error('Ошибка в настройках запроса:', error.message);
			}
		});
});

//Блокировка прокрутки страницы при открытом модальном окне
events.on('modal:open', () => {
	page.locked = true;
});

//Разблокировка прокрутки страницы
events.on('modal:close', () => {
	page.locked = false;
});
