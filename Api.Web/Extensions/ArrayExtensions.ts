'use strict';

import R from 'ramda';

export {};

declare global {
  interface Array<T> {
    mergeWithArrayById(another: Array<any>): Array<T>;
    getTotalOfShopping(): number;
    getSubtotalOfShopping(): number;
    getIvaOfShopping(): number;
  }
}

const getPriceWithoutIva = (product: any): number => {
  const tax = R.pathOr(0, ['taxes', '0', 'percentage'], product) * product.quantity;
  const priceWithoutIva = R.equals(tax, 0) ? 
    (product.pricePublic * product.quantity) / (1.16 * product.quantity) : 
    (product.pricePublic * product.quantity)  / (tax + 1);

  return priceWithoutIva;
}

Array.prototype.mergeWithArrayById = function (another: Array<any>) {
  const _self = this as Array<any>;
  const result = _self.map(item => {
    const id = item._id.toString();
    const selected = another.find(element => R.equals(id, element.productId.toString()));
    
    if (R.isEmpty(selected)) return;
    
    return Object.assign(item.toObject(), selected.toObject());
  })
  .filter(item => item);

  return result;
}

Array.prototype.getTotalOfShopping = function () {
  const _self = this as Array<any>;
  const total = _self.reduce((accumulator, product) => {
    const totalByQuantity = product.quantity * product.pricePublic;
    return accumulator + totalByQuantity;
  }, 0);

  return total;
}

Array.prototype.getSubtotalOfShopping = function () {
  const _self = this as Array<any>;
  const subtotal = _self.reduce((accumulator, product) => {
    const priceWithoutIva = getPriceWithoutIva(product);
    return accumulator + Math.floor(priceWithoutIva);
  }, 0);

  return subtotal;
}

Array.prototype.getIvaOfShopping = function () {
  const _self = this as Array<any>;
  const iva = _self.reduce((accumulator, product) => {
    const priceWithoutIva = getPriceWithoutIva(product);
    const iva = (product.pricePublic * product.quantity) - Math.floor(priceWithoutIva);

    return accumulator + iva;
  }, 0);

  return iva;
}