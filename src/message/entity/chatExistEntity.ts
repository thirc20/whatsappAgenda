import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ChatEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user: string;

    @Column()
    nameClient: string;

    @Column()
    inProgress: number;
}