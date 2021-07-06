/**
 * Information object for success created collect event
 * @param {String} type Collect type
 * @param {Number} amount Quantity to collect
 * @param {String} user User ID
 * @returns Object information
 */
export const successCreatedCollectEvent = (type: string, amount: number, user: string) => ({
  datetime: new Date(),
  appId: '',
  event: 'created_collect',
  level: 'INFO',
  description: `A collect of type ${type} and quantity ${amount} has been created for user ${user}`
});