import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import {RoleEnum} from "../../auth/role/role.enum";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp'})
    deleted_at: Date;

    @Column({unique: true})
    public username: string;

    @Column()
    public password: string;

    // @Column()
    // public permissions: Role[];

    @Column({type: 'jsonb', nullable: true})
    public roles: Array<RoleEnum>;

    @Column({default: 0})
    public operationCount: number;

}
