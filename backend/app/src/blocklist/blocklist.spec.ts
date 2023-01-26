import { Chatroom } from "src/chat/chat.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { Blocklist } from "./blocklist.entity";
import { occursInBlocklist } from "./blocklist.method";

let globalUser: User = new User();
globalUser.id = 1;
globalUser.intraId = "0";
globalUser.password = "password";
globalUser.playerName = "testUser";
globalUser.twoFA = false;

let globalUserTwo: User = new User();
globalUserTwo.id = 2;
globalUserTwo.intraId = "1";
globalUserTwo.password = "password";
globalUserTwo.playerName = "testUserTwo";
globalUserTwo.twoFA = false;

let globalUserThree: User = new User();
globalUserThree.id = 3;
globalUserThree.intraId = "2";
globalUserThree.password = "password";
globalUserThree.playerName = "testUserThree";
globalUserThree.twoFA = false;

let globalChatPublic = new Chatroom();
globalChatPublic.owner = globalUser;
globalChatPublic.member = [globalUser];
globalChatPublic.admin = [globalUser];
globalChatPublic.type = "public";
globalChatPublic.chatroomName = "test";

let messageOne = new Message();
messageOne.id = 1;
messageOne.body = "this is message one";
messageOne.createdAt = new Date();
messageOne.chatroomId = globalChatPublic;
messageOne.userId = globalUser;

let messageTwo = new Message();
messageTwo.id = 2;
messageTwo.body = "this is message two";
messageTwo.createdAt = new Date();
messageTwo.chatroomId = globalChatPublic;
messageTwo.userId = globalUserTwo;

let messageThree = new Message();
messageThree.id = 3;
messageThree.body = "this is message three";
messageThree.createdAt = new Date();
messageThree.chatroomId = globalChatPublic;
messageThree.userId = globalUserThree;

let messageFour = new Message();
messageFour.id = 4;
messageFour.body = "this is message four";
messageFour.createdAt = new Date();
messageFour.chatroomId = globalChatPublic;
messageFour.userId = globalUserTwo;

let messageFive = new Message();
messageFive.id = 5;
messageFive.body = "this is message five";
messageFive.createdAt = new Date();
messageFive.chatroomId = globalChatPublic;
messageFive.userId = globalUserTwo;

let globalMessages = [
  messageOne,
  messageTwo,
  messageThree,
  messageFour,
  messageFive,
];

let blockedUserOne = new Blocklist();
blockedUserOne.id = 1;
blockedUserOne.blockedUser = globalUserTwo;
blockedUserOne.blocklistOwner = globalUser;

let blockedUserTwo = new Blocklist();
blockedUserTwo.id = 2;
blockedUserTwo.blockedUser = globalUserThree;
blockedUserTwo.blocklistOwner = globalUser;

let globalBlocklist = [blockedUserOne, blockedUserTwo];

describe("occursInBlocklist function testing", () => {
  it("occursInBlocklist test (in blocklist: userTwo and userThree, checking if userTwo is in blocklist), true", () => {
    expect(occursInBlocklist(globalBlocklist, globalUserTwo.id)).toEqual(true);
  });
  it("occursInBlocklist test (in blocklist: userTwo and userThree, checking if userThree is in blocklist), true", () => {
    expect(occursInBlocklist(globalBlocklist, globalUserThree.id)).toEqual(
      true,
    );
  });
  it("occursInBlocklist test (in blocklist: userTwo and userThree, checking if userOne is in blocklist), false", () => {
    expect(occursInBlocklist(globalBlocklist, globalUser.id)).toEqual(false);
  });
});

// describe("filterMessages test", () => {
//   it();
// });
