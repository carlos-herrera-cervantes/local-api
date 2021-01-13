import { UseBefore } from '@tsed/common';
import { StoreSet, useDecorators } from '@tsed/core';
import { 
  ValidateRoleMiddleware,
  ValidateUserExistsMiddleware,
  ValidateClientExistsMiddleware,
  ValidateCollectExistsMiddleware,
  ValidateMeasurementExistsMiddleware,
  ValidatePaymentMethodExistsMiddleware,
  ValidatePositionExistsMiddleware,
  ValidateProductExistsMiddleware,
  ValidateShiftExistsMiddleware,
  ValidateSaleExistsMiddleware,
  ValidateTaxExistsMiddleware
} from '../middlewares/ValidatorMiddleware';

/**
 * Validates the user role
 * @param roles The valid roles for route handler
 * @returns Decorator
 */
export function ValidatorRole(...roles: string[]) {
  return useDecorators(
    StoreSet(ValidateRoleMiddleware, {
      roles
    }),
    UseBefore(ValidateRoleMiddleware)
  );
}

/**
 * Validates if user exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorUserExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateUserExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateUserExistsMiddleware)
  );
}

/**
 * Validates if client exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorClientExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateClientExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateClientExistsMiddleware)
  );
}

/**
 * Validates if collect exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorCollectExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateCollectExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateCollectExistsMiddleware)
  );
}

/**
 * Validates if measurement unit exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorMeasurementUnitExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateMeasurementExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateMeasurementExistsMiddleware)
  );
}

/**
 * Validates if payment method exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorPaymentExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidatePaymentMethodExistsMiddleware, {
      fields
    }),
    UseBefore(ValidatePaymentMethodExistsMiddleware)
  );
}

/**
 * Validates if position exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorPositionExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidatePositionExistsMiddleware, {
      fields
    }),
    UseBefore(ValidatePositionExistsMiddleware)
  );
}

/**
 * Validates if product exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorProductExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateProductExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateProductExistsMiddleware)
  );
}

/**
 * Validates if shift exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorShiftExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateShiftExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateShiftExistsMiddleware)
  );
}

/**
 * Validates if sale exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorSaleExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateSaleExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateSaleExistsMiddleware)
  );
}

/**
 * Validates if tax exists by specific filter
 * @param filter Object with specific fields to filter
 * @returns Decorator
 */
export function ValidatorTaxExists(...fields: string[]) {
  return useDecorators(
    StoreSet(ValidateTaxExistsMiddleware, {
      fields
    }),
    UseBefore(ValidateTaxExistsMiddleware)
  );
}