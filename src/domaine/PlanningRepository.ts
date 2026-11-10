import { PlanningSalle } from './PlanningSalle';
import { Salle } from './Salle';

export interface PlanningRepository {
  findBySalleAndDate(salle: Salle, date: string): PlanningSalle;
  save(planning: PlanningSalle): void;
}
