class Profile {
  constructor(id, profileId, profileName, email, phone, address, image, expoTokens = []) {
    this.id = id;
    this.profileId = profileId;
    this.profileName = profileName;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.image = image;
    this.expoTokens = expoTokens;
  }
}

export default Profile;
