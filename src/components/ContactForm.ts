import { Form } from './Form';
import { IEvents } from './base/EventEmitter';
import { IContactDetails } from '../types';

export class ContactForm
	extends Form<IContactDetails>
	implements IContactDetails
{
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	set email(text: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			text;
	}
	set contactNumber(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}
}
