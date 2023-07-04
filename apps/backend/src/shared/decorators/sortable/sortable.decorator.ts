import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SortOrder } from '../../enums/sort-order.enum';

@ValidatorConstraint({ name: 'Sortable', async: true })
export class SortableConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const fieldsArray = args.constraints;

    if (!value) {
      return true;
    }

    Object.keys(value).forEach((key) => {
      if (!fieldsArray.includes(key)) {
        throw new BadRequestException(`Invalid sort field: ${key}`);
      }

      const direction = value[key];
      if (direction !== SortOrder.ASCENDING && direction !== SortOrder.DESCENDING) {
        throw new BadRequestException(`Invalid sort order: ${value[key]}`);
      }
    });

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is already exists!`;
  }
}

export function Sortable(fieldsArray: string[], validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: fieldsArray,
      validator: SortableConstraint,
    });
  };
}
