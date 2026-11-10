import { DomainError } from './DomainError';

export class SalleInconnueError extends DomainError {
  constructor(id: string) {
    super('SALLE_INCONNUE', `salle ${id} does not exist`);
  }
}

export class Salle {
  constructor(
    readonly id: string,
    readonly nom: string,
    readonly capacite: number,
  ) {}
}
