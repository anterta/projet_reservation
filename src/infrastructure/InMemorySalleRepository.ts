import { Salle } from '../domaine/Salle';
import { SalleRepository } from '../domaine/SalleRepository';

export class InMemorySalleRepository implements SalleRepository {
  private readonly salles: Salle[] = [
    new Salle('A', 'Atelier', 4),
    new Salle('B', 'Bureau', 8),
    new Salle('C', 'Conférence', 20),
  ];

  findAll(): Salle[] {
    return [...this.salles];
  }
}
