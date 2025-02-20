import { IEvents } from './base/EventEmitter';
import { Form } from './Form';
import { IDeliveryDetails } from '../types';

export class DeliveryForm
	extends Form<IDeliveryDetails>
	implements IDeliveryDetails
{
	protected onlinePayment: HTMLButtonElement;
	protected cashPayment: HTMLButtonElement;
	payment: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.onlinePayment = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this.cashPayment = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		if (this.onlinePayment) {
			this.onlinePayment.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this.onlinePayment.name,
					button: this.onlinePayment,
				});
			});
		}

		if (this.cashPayment) {
			this.cashPayment.addEventListener('click', () => {
				events.emit(`payment:change`, {
					payment: this.cashPayment.name,
					button: this.cashPayment,
				});
			});
		}
	}

	set address(text: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			text;
	}

	addPayment(value: HTMLElement) {
		this.removePayment();
		this.toggleClass(value, 'button_alt-active', true);
	}

	removePayment() {
		this.toggleClass(this.onlinePayment, 'button_alt-active', false);
		this.toggleClass(this.cashPayment, 'button_alt-active', false);
	}
}
