import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class tb_messages{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    messageFrom: string;

    @Column()
    message: string;
    
    @Column()
    nameClient: string;

    @Column()
    idChat: string;
}