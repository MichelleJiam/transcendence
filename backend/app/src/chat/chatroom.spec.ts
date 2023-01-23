import {
  validateChatroomDto,
  validateChatroomName,
  validateChatroomPasswordSet,
  validateChatroomType,
  createChatroomEntity,
  createUpdatedChatroomEntity,
  deleteAdmin,
  deleteFromChatroom,
  swapOwner,
  addAdmin,
  addMember,
} from "./chat-validators.methods";
import { CreateChatroomDto } from "src/chat/dto/create-chat.dto";
import { UpdateChatroomDto } from "src/chat/dto/update-chat.dto";
import { User } from "src/user/user.entity";
import { Chatroom } from "src/chat/chat.entity";
import { HttpException } from "@nestjs/common";

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

let globalChatPublic = new Chatroom();
globalChatPublic.owner = globalUser;
globalChatPublic.member = [globalUser];
globalChatPublic.admin = [globalUser];
globalChatPublic.type = "public";
globalChatPublic.chatroomName = "test";

let globalChatPrivate = new Chatroom();
globalChatPrivate.owner = globalUser;
globalChatPrivate.member = [globalUser];
globalChatPrivate.admin = [globalUser];
globalChatPrivate.type = "private";
globalChatPrivate.chatroomName = "test";

let globalChatPassword = new Chatroom();
globalChatPassword.owner = globalUser;
globalChatPassword.member = [globalUser];
globalChatPassword.admin = [globalUser];
globalChatPassword.type = "password";
globalChatPassword.chatroomName = "test";

let globalChatDM = new Chatroom();
globalChatDM.owner = globalUser;
globalChatDM.member = [globalUser];
globalChatDM.admin = [globalUser];
globalChatDM.type = "DM";
globalChatDM.chatroomName = "test";

describe("validateChatroomType valid input", () => {
  // validateChatroomType
  it("validateChatroomType functionality (public), return true", () => {
    expect(validateChatroomType("public")).toEqual(true);
  });
  it("validateChatroomType functionality (private), return true", () => {
    expect(validateChatroomType("private")).toEqual(true);
  });
  it("validateChatroomType functionality (password), return true", () => {
    expect(validateChatroomType("password")).toEqual(true);
  });
  it("validateChatroomType functionality (DM), return true", () => {
    expect(validateChatroomType("DM")).toEqual(true);
  });
});

describe("validateChatroomType invalid input", () => {
  it("validateChatroomType functionality (test), should throw", () => {
    expect(() => validateChatroomType("test")).toThrow(HttpException);
  });
});

describe("validateChatroomName dtos valid input", () => {
  // validateChatroomName
  it("validateChatroomName functionality (test), return true", () => {
    expect(validateChatroomName("test")).toEqual(true);
  });
  it('validateChatroomName functionality (""), should throw', () => {
    expect(() => validateChatroomName("")).toThrow();
  });
  it('validateChatroomName functionality ("      "), should throw', () => {
    expect(() => validateChatroomName("      ")).toThrow();
  });
});

describe("external validators of chatroom dtos valid input", () => {
  // validateChatroomPasswordSet
  it("validateChatroomPasswordSet functionality, return true", () => {
    expect(validateChatroomPasswordSet("test")).toEqual(true);
  });
  it('validateChatroomPasswordSet functionality (""), should throw', () => {
    expect(() => validateChatroomPasswordSet("")).toThrow();
  });
  it('validateChatroomPasswordSet functionality ("       "), should throw', () => {
    expect(() => validateChatroomPasswordSet("         ")).toThrow();
  });

  // validateChatroomDto
  it("validateChatroomDto functionality, should return true", () => {
    let createChatroomDto: CreateChatroomDto = new CreateChatroomDto();
    createChatroomDto.type = "public";
    createChatroomDto.chatroomName = "test";
    createChatroomDto.user = 2;
    createChatroomDto.password = "";
    expect(validateChatroomDto(createChatroomDto)).toEqual(true);
  });
  it("validateChatroomDto functionality, should throw", () => {
    let createChatroomDto: CreateChatroomDto = new CreateChatroomDto();
    createChatroomDto.type = "not a type";
    createChatroomDto.chatroomName = "test";
    createChatroomDto.user = 2;
    createChatroomDto.password = "";
    expect(() => validateChatroomDto(createChatroomDto)).toThrow();
  });
});

describe("Creating chatroom entities, should work", () => {
  let createChatroomDtoPublic: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoPublic.type = "public";
  createChatroomDtoPublic.chatroomName = "test";
  createChatroomDtoPublic.user = 1;
  createChatroomDtoPublic.password = "";

  let createChatroomDtoDM: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoDM.type = "DM";
  createChatroomDtoDM.chatroomName = "test";
  createChatroomDtoDM.user = 1;
  createChatroomDtoDM.otherUser = 2;
  createChatroomDtoDM.password = "";

  let createChatroomDtoPassword: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoPassword.type = "password";
  createChatroomDtoPassword.chatroomName = "test";
  createChatroomDtoPassword.user = 1;
  createChatroomDtoPassword.password = "testpw";

  let createChatroomDtoPrivate: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoPrivate.type = "private";
  createChatroomDtoPrivate.chatroomName = "test";
  createChatroomDtoPrivate.user = 1;
  createChatroomDtoPrivate.password = "";

  let updatechatroomDto: UpdateChatroomDto = new UpdateChatroomDto();
  updatechatroomDto.chatroomName = "test2";

  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.owner = user;
  chatroomresult.member = [user];
  chatroomresult.admin = [user];
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  let chatroomresultPassword = new Chatroom();
  chatroomresultPassword.owner = user;
  chatroomresultPassword.member = [user];
  chatroomresultPassword.admin = [user];
  chatroomresultPassword.type = "password";
  chatroomresultPassword.password = "testpw";
  chatroomresultPassword.chatroomName = "test";

  let chatroomresultPrivate = new Chatroom();
  chatroomresultPrivate.owner = user;
  chatroomresultPrivate.member = [user];
  chatroomresultPrivate.admin = [user];
  chatroomresultPrivate.type = "private";
  chatroomresultPrivate.chatroomName = "test";

  let chatroomresultDM = new Chatroom();
  chatroomresultDM.owner = user;
  chatroomresultDM.member = [user, userTwo];
  chatroomresultDM.admin = [user, userTwo];
  chatroomresultDM.type = "DM";
  chatroomresultDM.chatroomName = "test";

  // creating an entity
  it("createChatroomEntity test (public), should work", () => {
    expect(createChatroomEntity(createChatroomDtoPublic, user)).toEqual(
      chatroomresult,
    );
  });
  it("createChatroomEntity test (password), should work", () => {
    expect(createChatroomEntity(createChatroomDtoPassword, user)).toEqual(
      chatroomresultPassword,
    );
  });
  it("createChatroomEntity test (private), should work", () => {
    expect(createChatroomEntity(createChatroomDtoPrivate, user)).toEqual(
      chatroomresultPrivate,
    );
  });
  it("createChatroomEntity test (DM), should work", () => {
    expect(createChatroomEntity(createChatroomDtoDM, user, userTwo)).toEqual(
      chatroomresultDM,
    );
  });
});

describe("Updating an existing chatroom", () => {
  let createChatroomDtoPublic: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoPublic.type = "public";
  createChatroomDtoPublic.chatroomName = "test";
  createChatroomDtoPublic.user = 1;
  createChatroomDtoPublic.password = "";

  let createChatroomDtoDM: CreateChatroomDto = new CreateChatroomDto();
  createChatroomDtoDM.type = "public";
  createChatroomDtoDM.chatroomName = "test";
  createChatroomDtoPublic.user = 1;
  createChatroomDtoPublic.otherUser = 2;
  createChatroomDtoDM.password = "";

  let updatechatroomDto: UpdateChatroomDto = new UpdateChatroomDto();
  updatechatroomDto.chatroomName = "test2";

  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.id = 1;
  chatroomresult.owner = user;
  chatroomresult.member = [user];
  chatroomresult.admin = [user];
  chatroomresult.password = "";
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  // updating an entity
  it("createUpdatedChatroomEntity test, should work", () => {
    let chatroomUpdated = new Chatroom();
    chatroomUpdated.id = 1;
    chatroomUpdated.owner = user;
    chatroomUpdated.member = [user];
    chatroomUpdated.admin = [user];
    chatroomUpdated.password = "";
    chatroomUpdated.type = "public";
    chatroomUpdated.chatroomName = "test2";
    expect(
      createUpdatedChatroomEntity(chatroomresult, updatechatroomDto),
    ).toEqual(chatroomUpdated);
  });
});

describe("deleting admin from chatroom", () => {
  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.id = 1;
  chatroomresult.owner = user;
  chatroomresult.member = [user, userTwo];
  chatroomresult.admin = [user, userTwo];
  chatroomresult.password = "";
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  let chatroomEnd = new Chatroom();
  chatroomEnd.id = 1;
  chatroomEnd.owner = user;
  chatroomEnd.member = [user, userTwo];
  chatroomEnd.admin = [user];
  chatroomEnd.password = "";
  chatroomEnd.type = "public";
  chatroomEnd.chatroomName = "test";
  it("deleteAdmin test, should work", () => {
    expect(deleteAdmin(chatroomresult, 2)).toEqual(chatroomEnd);
  });
});

describe("deleting completely from chatroom", () => {
  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.id = 1;
  chatroomresult.owner = user;
  chatroomresult.member = [user, userTwo];
  chatroomresult.admin = [user, userTwo];
  chatroomresult.password = "";
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  let chatroomEnd = new Chatroom();
  chatroomEnd.id = 1;
  chatroomEnd.owner = user;
  chatroomEnd.member = [user];
  chatroomEnd.admin = [user];
  chatroomEnd.password = "";
  chatroomEnd.type = "public";
  chatroomEnd.chatroomName = "test";
  it("deleteFromChatroom test, should work", () => {
    expect(deleteFromChatroom(chatroomresult, 2)).toEqual(chatroomEnd);
  });
});

describe("add member to chatroom", () => {
  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.id = 1;
  chatroomresult.owner = user;
  chatroomresult.member = [user];
  chatroomresult.admin = [user];
  chatroomresult.password = "";
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  let chatroomEnd = new Chatroom();
  chatroomEnd.id = 1;
  chatroomEnd.owner = user;
  chatroomEnd.member = [user, userTwo];
  chatroomEnd.admin = [user];
  chatroomEnd.password = "";
  chatroomEnd.type = "public";
  chatroomEnd.chatroomName = "test";
  it("addMember test, should work", () => {
    expect(addMember(chatroomresult, userTwo)).toEqual(chatroomEnd);
  });
});

describe("add admin to chatroom", () => {
  let user: User = new User();
  user.id = 1;
  user.intraId = "0";
  user.password = "password";
  user.playerName = "testUser";
  user.twoFA = false;

  let userTwo: User = new User();
  userTwo.id = 2;
  userTwo.intraId = "1";
  userTwo.password = "password";
  userTwo.playerName = "testUser2";
  userTwo.twoFA = false;

  let chatroomresult = new Chatroom();
  chatroomresult.id = 1;
  chatroomresult.owner = user;
  chatroomresult.member = [user];
  chatroomresult.admin = [user];
  chatroomresult.password = "";
  chatroomresult.type = "public";
  chatroomresult.chatroomName = "test";

  let chatroomEnd = new Chatroom();
  chatroomEnd.id = 1;
  chatroomEnd.owner = user;
  chatroomEnd.member = [user];
  chatroomEnd.admin = [user, userTwo];
  chatroomEnd.password = "";
  chatroomEnd.type = "public";
  chatroomEnd.chatroomName = "test";
  it("addAdmin test, should work", () => {
    expect(addAdmin(chatroomresult, userTwo)).toEqual(chatroomEnd);
  });
});

// describe("add admin to chatroom", () => {
//   let user: User = new User();
//   user.id = 1;
//   user.intraId = "0";
//   user.password = "password";
//   user.playerName = "testUser";
//   user.twoFA = false;

//   let userTwo: User = new User();
//   userTwo.id = 2;
//   userTwo.intraId = "1";
//   userTwo.password = "password";
//   userTwo.playerName = "testUser2";
//   userTwo.twoFA = false;

//   let chatroomresult = new Chatroom();
//   chatroomresult.id = 1;
//   chatroomresult.owner = user;
//   chatroomresult.member = [user];
//   chatroomresult.admin = [user];
//   chatroomresult.password = "";
//   chatroomresult.type = "public";
//   chatroomresult.chatroomName = "test";

//   let chatroomEnd = new Chatroom();
//   chatroomEnd.id = 1;
//   chatroomEnd.owner = user;
//   chatroomEnd.member = [user];
//   chatroomEnd.admin = [user, userTwo];
//   chatroomEnd.password = "";
//   chatroomEnd.type = "public";
//   chatroomEnd.chatroomName = "test";
//   it("addAdmin test, should work", () => {
//     expect(addAdmin(chatroomresult, userTwo)).toEqual(chatroomEnd);
//   });
// });
