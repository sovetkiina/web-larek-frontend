import { Api, ApiListResponse } from './base/Api';
import { IProduct, IOrderDetails, IOrderResponse } from '../types';

export interface IApiAdapter {
	getList: () => Promise<IProduct[]>;
	sendOrder(value: IOrderDetails): Promise<IOrderResponse>;
}

export class ApiAdapter extends Api implements IApiAdapter {
	constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	sendOrder(value: IOrderDetails): Promise<IOrderResponse> {
		return this.post('/order', value).then((data: IOrderResponse) => data);
	}
}
