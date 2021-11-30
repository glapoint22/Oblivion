import { Order } from "./order";
import { QueriedOrderProduct } from "./queried-order-product";

export class ProductOrders {
    public orders!: Array<Order>;
    public products!: Array<QueriedOrderProduct>;
}