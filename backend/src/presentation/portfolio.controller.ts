import { Body, Controller, Get, HttpCode, Inject, Param, Post } from '@nestjs/common';
import { PortfolioService } from '../application/portfolio.service';
import { ContactDto } from './contact.dto';

@Controller()
export class PortfolioController {
  constructor(@Inject(PortfolioService) private readonly portfolio: PortfolioService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'Mi Portafolio API' };
  }

  @Get('portfolio')
  getPortfolio() {
    return this.portfolio.getPortfolio();
  }

  @Get('projects/:slug')
  getProject(@Param('slug') slug: string) {
    return this.portfolio.getProject(slug);
  }

  @Post('contacts')
  @HttpCode(201)
  sendContact(@Body() input: ContactDto) {
    return this.portfolio.sendContact(input);
  }
}
