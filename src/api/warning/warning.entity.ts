import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Warning {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column({ default: '' })
	public servId: string;

	@Column()
	public replica: string;

	@Column()
	public method: string;

	@Column({ type: 'text' })
	public content: string;

	@Column()
	public file: string;

	@Column()
	public line: number;

	@CreateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP', 
	})
	public createdAt: Date;
}
