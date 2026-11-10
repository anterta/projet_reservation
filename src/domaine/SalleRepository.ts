import { Salle } from './Salle';

export interface SalleRepository {
  findAll(): Salle[];
  findById(id: string): Salle | undefined;
}
