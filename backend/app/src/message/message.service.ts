import { Body, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create_message.dto";
import { Message } from "./message.entity";


@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message) private readonly messageRepository: Repository<Message>,
	){}

	getAllMessages() {
		return this.messageRepository.find({ 
			relations: ['user_id'],
			order: {
				user_id: {
					id: "asc"
				}
			}});
	}

	async create(createMessageDto : CreateMessageDto) {
		const newMessage = this.messageRepository.create(createMessageDto);
		return this.messageRepository.save(newMessage);
	}

	async getMessageByUserId(id: number) {
	const messages = await this.messageRepository.find({
    	relations: {
        	user_id: true,
   		},
		where: {
			user_id: {
				id: id
			}
		},
		select: {
			user_id: {
				id: true,
				username: true,
				email: true
			},
			body: true,
			created_at: true
		}
	})
	if (messages)
		return messages;
		throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
	}

	// finds username and retrieves all messages from this user
	// relations links the user_id column in the message entity with
	// the id in the user entity
	// where defines where username is the same as the given username
	// select shows which columns should be returned
	// https://typeorm.io/find-options#find-options
	async getMessageByUsername(username: string) {
		const messages = await this.messageRepository.find({
			relations: {
				user_id: true,
			   },
			where: {
				user_id: {
					username: username
				}
			},
			select: {
				user_id: {
					id: true,
					username: true,
					email: true
				},
				body: true,
				created_at: true
			}
		})
		if (messages)
			return messages;
			throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
		}
}

