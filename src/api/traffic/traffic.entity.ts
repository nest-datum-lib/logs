import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	CreateDateColumn,
} from 'typeorm';

@Entity()
export class Traffic {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ default: '' })
	public userId: string;

	@Column({ default: '' })
	public replicaId: string;

	@Column()
	public ipAddr: string;

	@Column({ default: '' })
	public referrer: string;

	@Column()
	public method: string;

	@Column()
	public route: string;

	@Column({ type: 'text' })
	public headers: string;

	@Column({ type: 'text' })
	public cookies: string;

	@Column({ type: 'text' })
	public queries: string;

	@Column({ type: 'text' })
	public body: string;

	@CreateDateColumn({ 
		type: 'timestamp', 
		precision: null,
		default: () => 'CURRENT_TIMESTAMP', 
	})
	public createdAt: Date;
}
