import favicon from "../assets/favicon.png";
import user1 from "../assets/fakeProfilePhotos/user1.png";
import user2 from "../assets/fakeProfilePhotos/user2.png";
import user3 from "../assets/fakeProfilePhotos/user3.png";
import user4 from "../assets/fakeProfilePhotos/user4.png";
import user5 from "../assets/fakeProfilePhotos/user5.png";
import user6 from "../assets/fakeProfilePhotos/user6.png";
import user7 from "../assets/fakeProfilePhotos/user7.png";
import user8 from "../assets/fakeProfilePhotos/user8.png";
import submission1 from "../assets/fakeSubmissionPhotos/submission1.jpeg";
import submission2 from "../assets/fakeSubmissionPhotos/submission2.jpg";
import group1 from "../assets/fakeGroupPhotos/group1.jpeg";

export const groups = [
  {
    id: 1,
    name: "Friends",
    groupPhoto: group1,
    ownerId: 1,
    prompt: "This is the prompt of the day for the Friends group",
    votingTime: 18, // 6 PM
    members: [
      { id: 1, name: "User 1", photo: user1 },
      { id: 2, name: "User 2", photo: user2 },
      { id: 3, name: "User 3", photo: user3 },
    ],
    submissions: [
      { id: 2, photo: submission2, caption: "Caption 2", userId: 2 },
    ]
  },
  {
    id: 2,
    name: "Coworkers",
    ownerId: 2,
    prompt: "This is the prompt of the day for the Coworkers group",
    votingTime: 20, // 8 PM
    members: [
      { id: 1, name: "User 1", photo: user1 },
      { id: 3, name: "User 3", photo: user3 },
      { id: 4, name: "User 4", photo: user4 },
      { id: 5, name: "User 5", photo: user5 },
      { id: 6, name: "User 6", photo: user6 },
    ],
    submissions: [
      { id: 1, photo: submission1, caption: "Caption 1", userId: 1 },
      { id: 2, photo: submission2, caption: "Caption 2", userId: 4 },
    ]
  }
];

export const user = {
  id: 1,
  name: "User 1",
  photo: user1,
};