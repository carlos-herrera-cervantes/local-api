/** @Authentication */

export const okAuthentication = {
  status: true,
  data: '<AUTHENTICATION_TOKEN>'
};

/** @User */

export const userObjectExample = {
  _id: '5f947480c83ad110d92cde26',
  email: 'admin@remastered.com',
  firstName: 'User',
  lastName: 'Admin',
  password: 'secret123',
  cardMoneyAmount: 0,
  cashMoneyAmount: 0,
  role: 'Employee',
  createdAt: '2020-10-24T18:37:52.724Z',
  updatedAt: '2020-10-24T18:37:52.724Z'
};

/** @Shift */

export const shiftObjectExample = {
  _id: '5f947480c83ad110d92cde26',
  name: 'Matutino',
  order: 1,
  startTime: '08:00:00',
  endTime: '11:59:59',
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [
    '5fee38919ed84481b0a8c810'
  ],
  friday: [],
  saturday: [],
  sunday: [],
  createdAt: '2020-10-24T18:37:52.724Z',
  updatedAt: '2020-10-24T18:37:52.724Z'
};

/** @Collect */

export const collectObjectExample = {
  _id: '5f947480c83ad110d92cde26',
  user: '5fee38919ed84481b0a8c810',
  amount: 100,
  type: 'cash',
  createdAt: '2020-10-24T18:37:52.724Z',
  updatedAt: '2020-10-24T18:37:52.724Z'
};

/** @MeasurementUnit */

export const measurementObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  name: 'Litros',
  short: 'l',
  keySat: 'L',
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @PaymentMethod */

export const paymentMethodObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  key: '01',
  name: 'EFECTIVO',
  description: 'Pago en efectivo',
  status: true,
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @Position */

export const positionObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  status: '200',
  name: 'North 1',
  number: 1,
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @Sale */

export const saleObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  consecutive: 100,
  folio: 'GREE-FG675',
  status: '201',
  iva: 120,
  subtotal: 200,
  total: 250,
  tip: 0,
  totalLetters: 'DOSCIENTOS CINCUENTA PESOS',
  sendToCloud: true,
  paymentTransactionId: '5f435f2893421b0b8892d9a6',
  positionId: '5f435f3acc10cff533a85934',
  products: [],
  userId: '5f435f576d72dde61746ee70',
  clientId: '5f435f6789b9a3ecaba85a3f',
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @Product */

export const productObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  name: 'Aceite RE',
  price: 45,
  pricePublic: 50,
  description: 'Aceite para auto',
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @ShiftCut */

export const shiftCutObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  products: [
    {
      aditivos: 3
    }
  ],
  payments: [
    {
      efectivo: 300
    }
  ],
  collectsCash: [
    collectObjectExample
  ],
  collectsCards: [
    collectObjectExample
  ]
};

/** @Tax */

export const taxObjectExample = {
  _id: '5f4312fea39146efe94eb0fb',
  name: 'IVA',
  status: true,
  description: 'Impuesto al valor añadido',
  createdAt: '2011-01-21T11:33:21Z',
  updatedAt: '2011-01-21T11:33:21Z'
};

/** @Common */

export const listDataResponseExample = (data: object[]) => ({
  status: true,
  data
});

export const singleDataResponseExample = (data: object) => ({
  status: true,
  data
});

export const internalServerError = {
  status: false,
  message: '<MESSAGE>',
  code: 'Internal Server Error'
}

export const badRequest = {
  status: false,
  message: '<MESSAGE>',
  code: '<KEY_CODE>'
}