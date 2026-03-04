import { Branch } from "./branch";
import { MerchCustomization } from "./merch-customization";
import { MerchItem } from "./merch-item";

export interface Order {
    id:number,
    merch:MerchItem,
    customizations:MerchCustomization[],
    branch:Branch,
    quantity:number,
    receipt:string,
    total:number,
    created_at:Date,
}
