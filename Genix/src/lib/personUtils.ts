import { type Person } from '../types/Person';

export const hasSpouses = (person: Person): boolean => person.spouses !== undefined && person.spouses.length > 0

