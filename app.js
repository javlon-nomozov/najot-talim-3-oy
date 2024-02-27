const userModel = require("./models/user");
const guideModel = require("./models/guide");

(async () => {
  const user1 = await userModel.addUser("Ravshan", "Shukurov", 21);
  const user2 = await userModel.addUser("Ali", "Shukurov", 18);
  const user3 = await userModel.addUser("Abbos", "Shamsiyev", 30);
  const allUsers = await userModel.getAllUsers();
  const user11 = await userModel.getUserById(user1.id);
  const updatedUser = await userModel.updateUserById(user2.id, {
    ...user2,
    lastName: "Xolmatov",
  });
  const deletedUser = await userModel.deleteUserById(user3.id);

  console.log({
    user1,
    user2,
    user3,
    user11,
    allUsers,
    updatedUser,
    deletedUser,
  });

  const guide1 = await guideModel.addGuide(
    "Who are we reading and who are we citing?",
    "Their analysis shows some of the biases in our publication and citation practices..."
  );
  const guide2 = await guideModel.addGuide(
    "Celebrating Open Access",
    "We would like to acknowledge all the authors who appear in..."
  );
  const guide3 = await guideModel.addGuide(
    "By the Numbers",
    "A quick analysis of the top 10 “good reads” from 2022 reveals that the articles come..."
  );
  const allGuides = await guideModel.getAllGuides();
  const guide11 = await guideModel.getGuideById(guide1.id);
  const updatedGuide = await guideModel.updateGuideById(guide2.id, {
    ...guide2,
    title: "About this Year’s Selections",
  });
  const deletedGuide = await guideModel.deleteGuideById(guide3.id);

  console.log({
    guide1,
    guide2,
    guide3,
    guide11,
    allGuides,
    updatedGuide,
    deletedGuide,
  });
})();
