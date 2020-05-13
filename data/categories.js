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
  new Category('p8', 'Innerdörrar', '#d1d1e0'),
  new Category('p9', 'Ytterdörrar', '#d1d1e0'),
  new Category('p10', 'Kök', '#d1d1e0'),
  new Category('p11', 'Badrum', '#d1d1e0'),
  new Category('p12', 'Inredning', '#d1d1e0'),
  new Category('p13', 'Avlopp', '#d1d1e0'),
  new Category('p14', 'El', '#d1d1e0'),
  new Category('p15', 'Ventilation', '#d1d1e0'),
  new Category('p16', 'Värme', '#d1d1e0'),
  new Category('p17', 'Dekoration', '#d1d1e0'),
  new Category('p18', 'Annat', '#d1d1e0'),
];

export const CONDITION = [
  new Condition('c0', 'Inget', '#fff'),
  new Condition('c1', 'Dåligt', '#ebebfa'),
  new Condition('c2', 'Ok', '#ebebfa'),
  new Condition('c3', 'Bra', '#ebebfa'),
  new Condition('c4', 'Perfekt', '#ebebfa'),
];

export const STYLE = [
  new Category('s1', 'Ingen', '#fff'),
  new Category('s2', 'Modern', '#f0e6ff'),
  new Category('s3', 'Funkis', '#f0e6ff'),
  new Category('s4', 'Traditionell', '#f0e6ff'),
];

export const MATERIAL = [
  new Category('m1', 'Ingen', '#fff'),
  new Category('m2', 'Trä', '#f0e6ff'),
  new Category('m3', 'Plast', '#f0e6ff'),
  new Category('m4', 'Metall', '#f0e6ff'),
];

export const COLOR = [
  new Category('co1', 'Ingen', '#fff'),
  new Category('co2', 'Modern', '#f0e6ff'),
  new Category('co3', 'Funkis', '#f0e6ff'),
  new Category('co4', 'Traditionell', '#f0e6ff'),
];
