class Order {
  constructor(id, items, totalAmount, date) {
    //when creating a new order this is what the New Order() expect to receive
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
  }
}

export default Order;
