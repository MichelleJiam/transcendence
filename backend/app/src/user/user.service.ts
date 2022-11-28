import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create_user.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
	){}

	getAllUsers(){
		return this.userRepository.find();
	};

	async create(createUserDto: CreateUserDto){
		const newUser = this.userRepository.create(createUserDto);
		return this.userRepository.save(newUser);
	};

	async findUser(email: string){
		const found_user = this.userRepository.findOneBy({
			email: email
		});
		if (!found_user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
		return found_user;
	};

	async findUserById(id: number){
		const found_user = this.userRepository.findOneBy({
			id: id
		});
		if (!found_user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
		return found_user;
	};

	async getUserMessages(username : string){
		// this is how you do it from the opposite side, gets user and displays all messages by said user (Og from message.service.ts)
		const users = await this.userRepository.find({
			select: ["id", "username", "email"],
			where: {
				username : username // compares usernames and retrieves all the messages
			},
			relations: {
				messages: true,
			},
		})
		if (users)
			return users;
	}

	async deleteUser(id: number) {
		const deleteResponse = await this.userRepository.delete(id);
		if (!deleteResponse.affected) {
		  throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}
	  }
}

