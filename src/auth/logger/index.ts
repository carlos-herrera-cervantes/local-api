/**
 * Information object for success authentication event
 * @param user User identifier
 * @returns Object information
 */
export const successAuthEvent = user => ({
  datetime: new Date(),
  appId: '',
  event: 'auth_login_success',
  level: 'INFO',
  description: `User ${user} login successfully`
});