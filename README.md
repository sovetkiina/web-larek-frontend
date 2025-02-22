# Web-Larek | online-store for web-developers

Web-Larek — это приложение, предлагающее каталог товаров, предназначенных для профессионалов в области веб-разработки. Пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Приложение использует архитектурный паттерн MVP (Model-View-Presenter), обеспечивая эффективное разделение логики, интерфейса и представления данных.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами


##  Архитектура приложения

**Слой данных**: Отвечает за хранение, управление и обработку данных. Этот слой включает бизнес-логику, доступ к базе данных или внешним API.  
**Слой представления**: Отвечает за отображение данных и взаимодействие с пользователем.  
**Презентер**: Это посредник между представлением и моделью. Презентер получает данные от модели, обрабатывает  и передает представлению. Также он обрабатывает пользовательские действия, переданные из представления. Презентер в проекте реализован через событийную систему (EventEmitter).


### Базовый код 

#### Класс Api
Класс Api обеспечивает взаимодействие с сервером. Он отправляет HTTP-запросы (GET, POST, PUT, DELETE) и обрабатывает ответы от сервера. 
Основные функции:
* get — выполняет GET-запрос на указанный URL и возвращает промис с объектом, который вернул сервер в ответ.
* post — принимает объект с данными, которые будут переданы в формате JSON в теле запроса, и отправляет эти данные на указанный URL.
* В обоих методах (get, post) используется функция handleResponse, которая проверяет статус ответа и преобразует его в объект. Если ответ не успешен, она отклоняет промис с ошибкой.


#### Класс EventEmitter
Класс EventEmitter реализует механизм работы с событиями, позволяя подписываться на события и генерировать их в системе. Он используется для обработки и передачи данных между различными компонентами приложения.
Основные методы:
* on — подписка на событие.
* emit — генерация события.
* trigger — возвращает функцию для генерации события с переданным контекстом.
* onAll — подписка на все события.
* offAll — удаление всех обработчиков.

#### Класс Component
Базовый класс для наследования другими компонентами приложения. Обеспечивает набор инструментов для работы с DOM в производных классах. Конструктор принимает HTML-элемент, который будет служить контейнером для компонента.

Методы: 
* toggleClass(element: HTMLElement, className: string, force?: boolean) — добавляет или удаляет указанный класс у элемента в зависимости от параметра force.
* setText(element: HTMLElement, value: unknown) — устанавливает текстовое содержимое для элемента, наличие переданного элемента.
* setDisabled(element: HTMLElement, state: boolean) — изменяет доступность элемента для взаимодействия, активируя или блокируя его.
* setHidden(element: HTMLElement) — скрывает элемент.
* setVisible(element: HTMLElement) — отображает элемент.
* setImage(element: HTMLImageElement, src: string, alt?: string) — задаёт изображение для элемента с возможностью указать альтернативный текст.
* render(data?: Partial<T>) — возвращает корневой элемент DOM для компонента.


### Слой данных

#### Класс DataStore 
Класс представляет собой менеджер состояния, который отвечает за хранение и обработку данных приложения, таких как товары, корзина и информация о заказах. Он также управляет валидацией формы заказа и взаимодействует с системой событий для уведомления об изменениях. Конструктор принимает объект, реализующий интерфейс IEvents (from './base/EventEmitter'), для управления событиями.

Методы:  
**Для корзины**:  
* Класс управляет добавлением и удалением товаров из корзины с помощью методов addBasket и removeBasket. Эти методы  обновляют состояние корзины и сразу уведомляют о изменения через систему событий, используя метод notify. Метод setPreviewItem(product: IProduct) устанавливает товар для предпросмотра.  
**Для обработки заказа**:  
* Вся информация о заказе (продукты, цена, адрес и способ оплаты) хранится в объекте order. Класс поддерживает обновление этой информации через методы, такие как updatePayment, updateAddress, и updateOrder.  
**Для валидации формы заказа**:  
* В процессе оформления заказа класс выполняет валидацию обязательных полей с помощью метода validateOrder, который проверяет, заполнены ли все необходимые поля ( email, телефон, адрес и способ оплаты).
Класс отслеживает ошибки валидации формы в this.formErrors и уведомляет систему событий о их изменении (this.events.emit('formErrors:change', this.formErrors)).

**Структурa основного интерфейса**  
Интерфейс представляет объект карточки товара, который сервер присылает в составе массива.  
```
interface IProduct {
    id: string;
    name: string;
    price: number | null;
    description: string;
    category: string;
    image: string;
}
```

#### Класс ApiAdapter 
Класс служит для взаимодействия с сервером. Он наследует функциональность от базового класса Api. Основное назначение методов этого класса — получение данных с сервера и их предоставление в слое Presenter для отображения в пользовательском интерфейсе (View).

Методы:
* getList(): Promise<IProduct[]> - для получения списка продуктов.
* sendOrder(value: IOrderDetails): Promise<IOrderResponse> - отправляет заказ на сервер.

### Слой представления

#### Класс Page
Управляет отображением списка карточек продуктов и добавляет обработчик событий для корзины. Наследуется от базового класса component.

Методы:
* set productCatalog(items: HTMLElement[]) — Обновляет отображение каталога товаров.
* set itemCount(value: number) - Обновляет отображаемое количество товаров в корзине.

#### Класс ProductCard
Отвечает за отображение и управление карточкой товара в пользовательском интерфейсе.Установливает название, изображение, цену, категорию, описание и кнопку действия.

Методы:
* set price(value: number | null) — устанавливает стоимость товара,если цена отсутствует, отображает «Бесценно» и блокирует кнопку.
* set category(label: Category) — применяет категорию товара и соответствующий ей визуальный стиль.
* set image(link: string) — обновляет изображение карточки.
* set title(text: string) — задаёт заголовок карточки.
* set description(text: string) — заполняет описание товара.
* set buttonName(value: string) — изменяет текст на кнопке карточки.

#### Класс BasketItem
Класс представляет один товар, находящийся в корзине. Он является частью списка товаров, который отображается в корзине. Этот класс наследует функциональность от класса ProductCard (а тот, в свою очередь, наследует от Component) и добавляет для корзины функции, такие как отображение индекса товара в корзине и кнопку удаления товара из корзины.

Методы:
* set index(index: number) - устанавливает индекс товара в корзине.

#### Класс Basket
Класс Basket представляет корзину покупок, которая управляет списком товаров в корзине, отображает общую стоимость. Наследуется от класса component.

Методы:
* set products(products: HTMLElement[]) - устанавливает список товаров в корзину.Если в корзине есть товары, то метод обновляет содержимое, отображая все товары. Если корзина пуста, то показывается сообщение «В корзине пусто», и кнопка оформления заказа блокируется.

* set totalCost(cost: number) - устанавливает общую стоимость товаров в корзине.

#### Form
Класс Form представляет собой обобщённую форму, которая управляет её состоянием, обработкой ошибок, валидацией и отправкой данных. Наследует базовый класс Component.

Методы: 
* set valid(value: boolean) - устанавливает состояние кнопки отправки формы.
* set errors(value: string) - устанавливает текст ошибок.
* render( state: Partial<T> & Pick<IFormStructure<T> ) - отображает состояние формы, включая ошибки и валидность, а также обновляет значения полей ввода.
* resetForm() - Метод сбрасывает форму в её начальное состояние.
* protected inputChange(field: keyof T, value: string):void - обработа изменения значения поля формы.

#### DeliveryForm
Класс  представляет собой форму для оформления доставки с выбором способа оплаты. Этот класс расширяет базовый класс Form.

Методы:
* set address(text: string) - устанавливает значение поля ввода адреса в форме.
* addPayment(value: HTMLElement) — активирует выбранный способ оплаты (кнопка для онлайн-оплаты или наличных).
* removePayment() — метод  для деактивации всех кнопок оплаты, обеспечивая, что в форме не будет выбрано несколько способов оплаты одновременно.

#### ContactForm
Класс  представляет собой форму для ввода контактных данных (второй этап заполнения контактных данных). Этот класс расширяет обобщённый класс Form.

Методы:
* set phone (value: string)- устанавливает значение поля для ввода номера телефона в форме.
* set email (text: string) - устанавливает значение поля для ввода email в форме.

#### TransactionSuccess
Класс представляет собой компонент, отображающий успешное завершение транзакции с финальным сообщением. Этот компонент выводит информацию о завершенной операции и позволяет закрыть окно с результатами.Наследуется от класса component.

Методы:
* set count(total: number | string) - устанавливает текст, отображающий результат завершенной операции.

#### Класс Modal
Класс  представляет собой компонент для отображения модальных окон,обрабатывает открытие и закрытие модального окна.

Методы:
* set content(content: HTMLElement) - Устанавливает или обновляет содержимое модального окна.
* renderContent(content: ModalRender): HTMLElement - Отображает модальное окно.
* open() -  Открывает модальное окно и отображает его.
* close() - Закрывает модальное окно и скрывает его.


### index.ts
 index.ts выполняет функции центрального посредника между моделью, представлением  и бизнес-логикой через событийную систему (EventEmitter).

## Основные функции index.ts

1. **Инициализация зависимостей**
Подключает SCSS-стили (styles.scss)  
Импортирует константы (API_URL, CDN_URL)  
Подключает интерфейсы  
Импортирует классы  

2. **Создание основных объектов**

api → адаптер API для работы с сервером  
events → система событий (EventEmitter) для управления взаимодействием  
appState → хранилище состояния данных (DataStore)  
page → управляет отображением страницы  
modal → управляет модальными окнами  
basket → объект корзины товаров  
contacts, delivery, success → формы оформления заказа и подтверждения  

3. **Загрузка данных с сервера**

Получает список товаров через api.getList()  
Передает их в хранилище appState  
Вызывает событие items:create, чтобы отрисовать товары  

4. **Рендеринг каталога товаров**

Создает карточки товаров (ProductCard)  
При клике на карточку отправляет событие card:select  

5. **Управление предпросмотром товара**

При выборе товара (card:select) обновляет appState  
Открывает модальное окно с детальной информацией (preview:changed)  

6. **Работа с корзиной**

Открытие (basket:open) → рендер корзины  
Изменения (basket:changed) → обновление списка товаров и общей стоимости  
Добавление (product:add) и удаление (product:delete) товаров  

7. **Оформление заказа**

order:open → открывает форму доставки  
order:submit → открывает форму контактов  
contacts:submit → отправляет заказ на сервер через api.sendOrder()  
**
8. **Валидация форм**

При изменении данных (formErrors:change) обновляет ошибки в формах  
Проверяет корректность контактных данных и информации о доставке  

9. **Обработка способов оплаты и полей заказа**

payment:change → устанавливает выбранный метод оплаты.
order:change / contacts:change → обновляет поля заказа  

10. **Финальное подтверждение заказа**

После успешной отправки заказа (contacts:submit) отображает TransactionSuccess.  
Очищает корзину (appState.clearBasket()).  

11. **Управление модальными окнами**

modal:open → блокирует прокрутку страницы.  
modal:close → разблокирует прокрутку.  


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```