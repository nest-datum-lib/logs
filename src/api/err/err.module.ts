import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	RegistryService,
	LogsService,
	CacheService, 
} from '@nest-datum/services';
import { Err } from './err.entity';
import { ErrService } from './err.service';
import { ErrController } from './err.controller';

@Module({
	controllers: [ ErrController ],
	imports: [
		TypeOrmModule.forFeature([ Err ]),
	],
	providers: [
		RegistryService, 
		LogsService,
		CacheService,
		ErrService, 
	],
})
export class ErrModule {
}
