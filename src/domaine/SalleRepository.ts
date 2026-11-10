import { Salle } from './Salle';

export interface SalleRepository {
  findAll(): Salle[];
}
