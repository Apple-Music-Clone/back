import { PipeTransform, Injectable } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SanitizePipe implements PipeTransform {
  constructor(private readonly className: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    return plainToClass(this.className, value, {
      excludeExtraneousValues: true,
    });
  }
}
