import { Component } from './base/Сomponent';
import {ensureElement} from "../utils/utils";
import { IConfirmationModalActions} from "../types";

export class TransactionSuccess extends Component<never> {
    protected closeButton: HTMLButtonElement;
    protected totalSpentInfo: HTMLElement;

    constructor(container: HTMLElement, operation: IConfirmationModalActions) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.totalSpentInfo = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (operation?.Click) {
                this.closeButton.addEventListener('click', operation.Click)
        }
    }

    set count(total: number | string) {
        if (total === undefined || total === null) {
            console.error('Total count is undefined or null');
            total = 0;
        }
        this.totalSpentInfo.textContent = `Списано ${total} синапсов`;
    }
    
}