import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rt/prisma';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model] = args.constraints;

    if (!value || !model) return false;

    if (!this.prisma[model]) throw new Error(`Model ${model} does not exist`);

    const record = await (this.prisma[model] as any).findUnique({
      where: {
        [args.property]: value,
      },
    });

    return record === null;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exists!`;
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
