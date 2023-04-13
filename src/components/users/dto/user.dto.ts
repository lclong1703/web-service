import { Status } from '../entity/user.entity';

export interface User {
  readonly id: number;
  name: string;
  email: string;
  password: string;
  key: string;
  status: Status;
  expire_code: string;
}
