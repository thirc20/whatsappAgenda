import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class VenonBotEntityi{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    messageFrom: number;

    @Column()
    fk_chat: number;
}