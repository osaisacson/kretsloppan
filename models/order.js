import moment from 'moment';

class Order {
  constructor(id, items, totalAmount, date, imageUrl) {
    //when creating a new order this is what the New Order() expect to receive
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
    this.imageUrl = imageUrl;
  }

  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Order;
