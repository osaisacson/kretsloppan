import Category from '../models/category';
import Condition from '../models/condition';

export const PART = [
  new Category('p0', 'Ingen', '#fff'),
  new Category('p1', 'Grund', '#d1d1e0'),
  new Category('p2', 'Stomme', '#d1d1e0'),
  new Category('p3', 'Väggar', '#d1d1e0'),
  new Category('p4', 'Tak', '#d1d1e0'),
  new Category('p5', 'Bjälklag', '#d1d1e0'),
  new Category('p6', 'Golv', '#d1d1e0'),
  new Category('p7', 'Fönster', '#d1d1e0'),
  new Category('p8', 'Dörrar', '#d1d1e0'),
  new Category('p9', 'Kök', '#d1d1e0'),
  new Category('p10', 'Badrum', '#d1d1e0'),
  new Category('p11', 'Inredning', '#d1d1e0'),
  new Category('p12', 'Avlopp', '#d1d1e0'),
  new Category('p13', 'El', '#d1d1e0'),
  new Category('p14', 'Ventilation', '#d1d1e0'),
  new Category('p15', 'Uppvärmning', '#d1d1e0'),
  new Category('p16', 'Annat', '#d1d1e0'),
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
