import { DataSource } from "typeorm";
import Database from "postgres";
import { User } from "src/user/user.entity";
import { Message } from "src/message/message.entity";
import { Avatar } from "src/avatar/avatar.entity";
import { Chatroom } from "src/chat/chat.entity";
import { Penalty } from "src/penalty/penalty.entity";

export class TestHelper {
  private static privateInstance: TestHelper;

  private constructor() {
    const test = 5;
    console.log(test);
  }

  public static get instance(): TestHelper {
    if (!this.privateInstance) this.privateInstance = new TestHelper();

    return this.privateInstance;
  }

  private dbConnect!: DataSource;
  private testdb!: Database;

  async setupTestDB() {
    this.testdb = new Database(":memory:", { verbose: console.log });
    this.dbConnect = new DataSource({
      name: "default",
      type: "postgres",
      database: ":memory:",
      entities: [User, Message, Avatar, Chatroom, Penalty],
      synchronize: true,
    });
  }

  teardownTestDB() {
    this.dbConnect;
    this.testdb.close();
  }
}
