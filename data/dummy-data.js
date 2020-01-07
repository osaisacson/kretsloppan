import Category from '../models/category';
import Product from '../models/product';

export const CATEGORIES = [
  new Category('c1', 'Stomme', '#f5428d'),
  new Category('c2', 'Tak', '#f54242'),
  new Category('c3', 'Grund', '#f5a442'),
  new Category('c4', 'Fönster', '#f5d142'),
  new Category('c5', 'Maskiner', '#368dff'),
  new Category('c6', 'Diverse', '#41d95d')
];

const PRODUCTS = [
  new Product(
    'p1',
    'u1',
    'Takbeläggning',
    'https://images.unsplash.com/photo-1496098236379-e7c6cfb4a70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=933&q=80',
    'Något använd.',
    350,
    'Tak'
  ),
  new Product(
    'p2',
    'u1',
    'Corrugated iron sheets',
    'https://images.unsplash.com/photo-1519919558328-a1a0fd2def7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1946&q=80',
    'De bara skriker "ta dina stelkrampssprutor"',
    135,
    'Tak'
  ),
  new Product(
    'p3',
    'u2',
    'Trästockar',
    'https://images.unsplash.com/photo-1558350002-195a30cc50b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    'Bäckar, bockar, stockar, lockar?',
    255,
    'Stomme'
  ),
  new Product(
    'p4',
    'u3',
    'Fönster',
    'https://images.unsplash.com/photo-1519292585351-6f2aeb34ce86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2076&q=80',
    'Själens ögon enna',
    46,
    'Fönster'
  ),
  new Product(
    'p5',
    'u3',
    'Kassaapparat',
    'https://images.unsplash.com/photo-1565084980783-c76b5fe34717?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    "Aw, look at the charm. Plus it's probably haunted.",
    360,
    'Diverse'
  ),
  new Product(
    'p6',
    'u1',
    'Grävskopa',
    'https://images.unsplash.com/photo-1504306763499-721d07597b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1535&q=80',
    'En litn grävskopa.',
    320,
    'Maskiner'
  )
];

export default PRODUCTS;
