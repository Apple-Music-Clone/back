import { ValueTransformer } from 'typeorm';
import { hashSync, compareSync } from 'bcrypt';

export class BCryptTransformer implements ValueTransformer {
  to(value: string) {
    return value && hashSync(value, 10);
  }
  from(value: string) {
    return value;
  }
  compare(data, encrypted) {
    return compareSync(data, encrypted);
  }
}
