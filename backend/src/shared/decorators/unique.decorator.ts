import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model] = args.constraints;

    if (!value || !model) return false;

    if (!this.prisma[model]) throw new Error(`Model ${model} is not exist`);

    const record = await this.prisma[model].findUnique({
      where: {
        [args.property]: value,
      },
    });

    return record === null;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is already exists!`;
  }
}

export function Unique(model: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model],
      validator: UniqueConstraint,
    });
  };
}
