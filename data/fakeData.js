import favicon from "../assets/favicon.png";

export const groups = [
  {
    id: 1,
    name: "Group 1 this is a name",
    groupPhoto: favicon,
    prompt: "This is Group 1",
    members: [
      { id: 1, name: "User 1", photo: favicon },
      { id: 2, name: "User 2", photo: favicon },
      { id: 3, name: "User 3", photo: favicon },
    ],
    submissions: [
      { id: 1, photo: favicon, caption: "Caption 1", userId: 1 },
      { id: 2, photo: favicon, caption: "Caption 2", userId: 2 },
    ]
  },
];

export const user = {
  id: 1,
  name: "User 1",
  photo: favicon,
};