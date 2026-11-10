import { Salle } from '../domaine/Salle';
import { SalleRepository } from '../domaine/SalleRepository';

export class ListSalles {
  constructor(private readonly salleRepository: SalleRepository) {}

  execute(): Salle[] {
    return this.salleRepository.findAll();
  }
}
