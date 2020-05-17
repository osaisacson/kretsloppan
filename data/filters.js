import Filter from '../models/filter';

export const PART = [
  new Filter('p0', 'Ingen', 'transparent'),
  new Filter('p1', 'Grund', '#d1d1e0'),
  new Filter('p2', 'Stomme', '#d1d1e0'),
  new Filter('p3', 'Innervägg', '#d1d1e0'),
  new Filter('p4', 'Yttervägg', '#d1d1e0'),
  new Filter('p5', 'Tak', '#d1d1e0'),
  new Filter('p6', 'Bjälklag', '#d1d1e0'),
  new Filter('p7', 'Golv', '#d1d1e0'),
  new Filter('p8', 'Mark', '#d1d1e0'),
  new Filter('p9', 'Fönster', '#d1d1e0'),
  new Filter('p10', 'Innerdörrar', '#d1d1e0'),
  new Filter('p11', 'Ytterdörrar', '#d1d1e0'),
  new Filter('p12', 'Kök', '#d1d1e0'),
  new Filter('p13', 'Badrum', '#d1d1e0'),
  new Filter('p14', 'Inredning', '#d1d1e0'),
  new Filter('p15', 'Avlopp', '#d1d1e0'),
  new Filter('p16', 'El', '#d1d1e0'),
  new Filter('p17', 'Ventilation', '#d1d1e0'),
  new Filter('p18', 'Värme', '#d1d1e0'),
  new Filter('p19', 'Dekoration', '#d1d1e0'),
  new Filter('p20', 'Redskap', '#d1d1e0'),
  new Filter('p21', 'Annat', '#d1d1e0'),
];

export const CONDITION = [
  new Filter('c0', 'Inget', 'transparent'),
  new Filter('c1', 'Dåligt', '#ebebfa'),
  new Filter('c2', 'Ok', '#ebebfa'),
  new Filter('c3', 'Bra', '#ebebfa'),
  new Filter('c4', 'Perfekt', '#ebebfa'),
  new Filter('c5', 'Varierande', '#ebebfa'),
];

export const STYLE = [
  new Filter('s1', 'Ingen', 'transparent'),
  new Filter('s2', 'Modern', '#f0e6ff'),
  new Filter('s3', 'Funkis', '#f0e6ff'),
  new Filter('s4', 'Traditionell', '#f0e6ff'),
];

export const MATERIAL = [
  new Filter('m1', 'Inget', 'transparent'),
  new Filter('m2', 'Trä', '#f0e6ff'),
  new Filter('m3', 'Plast', '#f0e6ff'),
  new Filter('m4', 'Metall', '#f0e6ff'),
  new Filter('m5', 'Sten', '#f0e6ff'),
  new Filter('m6', 'Tegel', '#f0e6ff'),
  new Filter('m7', 'Glas', '#f0e6ff'),
  new Filter('m8', 'Textil', '#f0e6ff'),
  new Filter('m9', 'Betong', '#f0e6ff'),
  new Filter('m10', 'Blandat', '#f0e6ff'),
  new Filter('m11', 'Annat', '#f0e6ff'),
];

export const COLOR = [
  new Filter('Ingen', 'Ingen', 'transparent'),
  new Filter('Vit', '', '#fff'),
  new Filter('Gul', '', '#ffbb00'),
  new Filter('Orange', '', '#f56f02'),
  new Filter('Röd', '', '#cb1f47'),
  new Filter('Rosa', '', '#d10161'),
  new Filter('Lila', '', '#645dac'),
  new Filter('Blå', '', '#0088d2'),
  new Filter('Grön', '', '#00b345'),
  new Filter('Grå', '', '#666'),
  new Filter('Svart', '', '#000'),
];
