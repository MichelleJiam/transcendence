import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avatar {
	@PrimaryGeneratedColumn({
		name: "avatar_id",
	})
	public id?: number;

	@Column()
	public filename?: string;

	@Column({ type: "bytea" })
	public data?: Uint8Array;
}

// export interface AvatarData {
// 	filename: string;
// 	data: Buffer;
// }
