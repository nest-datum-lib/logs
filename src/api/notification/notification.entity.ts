import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column({ default: '' })
	public servId: string;

	@Column()
	public replica: string;

	@Column()
	public action: string;

	@Column({ type: 'text' })
	public content: string;

	@CreateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP', 
	})
	public createdAt: Date;
}
