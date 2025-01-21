import { Login } from 'src/login/login.entity';
import { Position } from 'src/position/entities/position.entity';
import { Unit } from 'src/unit/entities/unit.entity';

export class User {
  id: number;
  name: string;
  username: string;
  password: string;
  joinDate: Date;
  jumlahLogin?: number; // (Opsional jika tetap menyimpan jumlah login)
  unitId: number;
  unit: Unit;
  positions: Position[];
  logins: Login[];
  createdAt: Date;
  updatedAt: Date;
}
