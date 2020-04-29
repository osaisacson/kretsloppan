import Category from '../models/category';
import Condition from '../models/condition';

export const PART = [
  new Category('p0', 'Ingen', '#fff'),
  new Category('p1', 'Stomme', '#d1d1e0'),
  new Category('p2', 'Tak', '#d1d1e0'),
  new Category('p3', 'Grund', '#d1d1e0'),
  new Category('p4', 'Fönster', '#d1d1e0'),
  new Category('p5', 'Dörrar', '#d1d1e0'),
  new Category('p6', 'Maskiner', '#d1d1e0'),
  new Category('p7', 'Diverse', '#d1d1e0'),
  new Category('p8', 'Annat', '#d1d1e0'),
];

export const CONDITION = [
  new Condition('c0', 'Inget', '#fff'),
  new Condition('c1', 'Dåligt', '#ebebfa'),
  new Condition('c2', 'Ok', '#ebebfa'),
  new Condition('c3', 'Bra', '#ebebfa'),
  new Condition('c4', 'Perfekt', '#ebebfa'),
];

export const OTHER = [
  new Category('o1', 'aaa', '#fff'),
  new Category('o2', 'bbb', '#f0e6ff'),
  new Category('o3', 'ccc', '#f0e6ff'),
  new Category('o4', 'ddd', '#f0e6ff'),
  new Category('o5', 'eee', '#f0e6ff'),
  new Category('o6', 'fff', '#f0e6ff'),
  new Category('o7', 'ggg', '#f0e6ff'),
  new Category('o8', 'hhh', '#f0e6ff'),
];
