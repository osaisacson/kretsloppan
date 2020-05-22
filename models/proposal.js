class Proposal {
  constructor(id, ownerId, projectId, title, description, price, date, status) {
    this.id = id;
    this.ownerId = ownerId;
    this.projectId = projectId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.date = date;
    this.status = status;
  }
}

export default Proposal;
