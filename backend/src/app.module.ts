import { Module } from '@nestjs/common';
import { PortfolioService, PORTFOLIO_REPOSITORY } from './application/portfolio.service';
import { SupabasePortfolioRepository } from './infrastructure/supabase-portfolio.repository';
import { PortfolioController } from './presentation/portfolio.controller';

@Module({
  controllers: [PortfolioController],
  providers: [
    PortfolioService,
    { provide: PORTFOLIO_REPOSITORY, useClass: SupabasePortfolioRepository },
  ],
})
export class AppModule {}
