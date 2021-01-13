import { Property, Required, Default, ReadOnly } from "@tsed/schema";

export class HttpException {

  @Property()
  @ReadOnly()
  @Default(false)
  status: boolean = false;

  @Property()
  @Required()
  message: string;

  @Property()
  @Required()
  code: string;

  @Property()
  @Required()
  context: any;

  constructor(message: string, code: string, context: any) {
    this.message = message;
    this.code = code;
    this.context = context;
  }

  /**
   * Returns a base object response
   * @param statusCode Number of status code
   * @returns HttpResponse
   */
  private useBaseResponse(statusCode: number): any {
    return this.context.status(statusCode).send({ status: this.status, message: this.message, code: this.code });
  }

  /**
   * Returns bad request response to the client
   * @returns HttpResponse
   */
  sendBadRequest(): any {
    return this.useBaseResponse(400);
  }

  /**
   * Returns a forbidden response to the client
   * @returns HttpResponse
   */
  sendForbidden(): any {
    return this.useBaseResponse(403);
  }

  /**
   * Returns a not found response to the client
   * @returns HttpResponse
   */
  sendNotFound(): any {
    return this.useBaseResponse(404);
  }

  /**
   * Returns internal server error response to the client
   * @returns HttpResponse
   */
  sendInternalServerError(): any {
    return this.context.status(500).send({ status: this.status, message: this.message, code: 'InternalServerError' });
  }
}