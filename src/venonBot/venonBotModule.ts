import { Module } from '@nestjs/common';
import { InitializeVenonBot } from './business/venonBotService';
import { VenonBotController } from './controller/venonBotController';

@Module({
    imports: [],
    controllers: [VenonBotController],
    providers: [InitializeVenonBot],
})

export class VenonBotModule {}