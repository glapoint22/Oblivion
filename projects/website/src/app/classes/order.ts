import { OrderProduct } from "./order-product";

export class Order {
    public orderNumber!: string;
    public date!: string;
    public paymentMethod!: string;
    public paymentMethodImg!: string;
    public subtotal!: number;
    public shippingHandling!: number;
    public discount!: number;
    public tax!: number;
    public total!: number;
    public productId!: number;
    public hoplink!: string;
    public products!: Array<OrderProduct>;
}