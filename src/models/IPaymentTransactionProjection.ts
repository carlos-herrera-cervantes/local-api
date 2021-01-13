import { PaymentMethod } from './PaymentMethod';

export interface IPaymentTransactionProjectionBase {
  _id: string,
  status: number,
  quantity: number,
  metadata: any,
  paymentMethod: PaymentMethod
}