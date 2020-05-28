class Profile {
  constructor(
    id,
    profileId,
    profileName,
    profileDescription,
    email,
    phone,
    address,
    defaultPickupDetails,
    image,
    expoTokens = []
  ) {
    this.id = id;
    this.profileId = profileId;
    this.profileName = profileName;
    this.profileDescription = profileDescription;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.defaultPickupDetails = defaultPickupDetails;
    this.image = image;
    this.expoTokens = expoTokens;
  }
}

export default Profile;
