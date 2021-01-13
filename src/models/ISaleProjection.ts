import { IProductProjection } from './IProductProjection';
import { IPaymentTransactionProjectionBase } from './IPaymentTransactionProjection';
import { Client } from './Client';

export interface ISaleProjection {
  _id: string,
  consecutive: number,
  station: string,
  folio: string,
  status: string,
  iva: number,
  subtotal: number,
  total: number,
  tip: number,
  totalLetters: string,
  sendToCloud: boolean,
  paymentTransaction: IPaymentTransactionProjectionBase;
  position: string,
  products: IProductProjection[],
  user: string,
  client: Client,
}