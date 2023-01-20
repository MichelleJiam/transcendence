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
} from "../../src/chat/chat-validators.methods";
import { CreateChatroomDto } from "src/chat/dto/create-chat.dto";
import { UpdateChatroomDto } from "src/chat/dto/update-chat.dto";
import { User } from "src/user/user.entity";
import { Chatroom } from "src/chat/chat.entity";

describe("external validators of chatroom dtos (e2e)", () => {
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
  it("validateChatroomType functionality (test), should throw", () => {
    expect(validateChatroomType("test")).toThrow();
  });

  // validateChatroomName
  it("validateChatroomName functionality (test), return true", () => {
    expect(validateChatroomName("test")).toEqual(true);
  });
  it('validateChatroomName functionality (""), should throw', () => {
    expect(validateChatroomName("")).toThrow();
  });
  it('validateChatroomName functionality ("      "), should throw', () => {
    expect(validateChatroomName("      ")).toThrow();
  });

  // validateChatroomPasswordSet
  it("validateChatroomPasswordSet functionality, return true", () => {
    expect(validateChatroomPasswordSet("test")).toEqual(true);
  });
  it('validateChatroomPasswordSet functionality (""), should throw', () => {
    expect(validateChatroomPasswordSet("")).toThrow();
  });
  it('validateChatroomPasswordSet functionality ("       "), should throw', () => {
    expect(validateChatroomPasswordSet("         ")).toThrow();
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
    expect(validateChatroomDto(createChatroomDto)).toThrow();
  });
});

describe("Creating chatroom entities", () => {
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

  // creating an entity
  it("createChatroomEntity test, should work", () => {
    expect(createChatroomEntity(createChatroomDtoPublic, user)).toEqual(
      chatroomresult,
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
