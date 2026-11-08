import type { Experiment } from '../types';
import { nonReducingSugar } from './nonReducingSugar';
import { reducingSugar } from './reducingSugar';

export const EXPERIMENTS: Experiment[] = [nonReducingSugar, reducingSugar];

export const getExperiment = (id: string) => EXPERIMENTS.find((e) => e.id === id);