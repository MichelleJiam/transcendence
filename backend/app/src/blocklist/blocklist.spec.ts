import { Chatroom } from "src/chat/chat.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { Blocklist } from "./blocklist.entity";
import { filterMessages, occursInBlocklist } from "./blocklist.method";

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

let messageOneByOne = new Message();
messageOneByOne.id = 1;
messageOneByOne.body = "this is message one";
messageOneByOne.createdAt = new Date();
messageOneByOne.chatroomId = globalChatPublic;
messageOneByOne.userId = globalUser;

let messageTwoByTwo = new Message();
messageTwoByTwo.id = 2;
messageTwoByTwo.body = "this is message two";
messageTwoByTwo.createdAt = new Date();
messageTwoByTwo.chatroomId = globalChatPublic;
messageTwoByTwo.userId = globalUserTwo;

let messageThreeByThree = new Message();
messageThreeByThree.id = 3;
messageThreeByThree.body = "this is message three";
messageThreeByThree.createdAt = new Date();
messageThreeByThree.chatroomId = globalChatPublic;
messageThreeByThree.userId = globalUserThree;

let messageFourByTwo = new Message();
messageFourByTwo.id = 4;
messageFourByTwo.body = "this is message four";
messageFourByTwo.createdAt = new Date();
messageFourByTwo.chatroomId = globalChatPublic;
messageFourByTwo.userId = globalUserTwo;

let messageFiveByTwo = new Message();
messageFiveByTwo.id = 5;
messageFiveByTwo.body = "this is message five";
messageFiveByTwo.createdAt = new Date();
messageFiveByTwo.chatroomId = globalChatPublic;
messageFiveByTwo.userId = globalUserTwo;
messageFiveByTwo;

let globalMessages = [
  messageOneByOne,
  messageTwoByTwo,
  messageThreeByThree,
  messageFourByTwo,
  messageFiveByTwo,
];

let resultMessages = [messageOneByOne];

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

describe("filterMessages test", () => {
  it("Message filtered by blocklist", () => {
    expect(filterMessages(globalMessages, globalBlocklist)).toEqual(
      resultMessages,
    );
  });
});
