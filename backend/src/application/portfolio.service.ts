import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { isValidContact, normalizeContact } from '../domain/contact';
import type { ContactMessage, PortfolioRepository } from '../domain/portfolio';

export const PORTFOLIO_REPOSITORY = Symbol('PORTFOLIO_REPOSITORY');

@Injectable()
export class PortfolioService {
  constructor(
    @Inject(PORTFOLIO_REPOSITORY)
    private readonly repository: PortfolioRepository,
  ) {}

  getPortfolio() {
    return this.repository.getPortfolio();
  }

  async getProject(slug: string) {
    const project = await this.repository.getProject(slug);
    if (!project) throw new NotFoundException('Proyecto no encontrado');
    return project;
  }

  async sendContact(input: ContactMessage) {
    const message = normalizeContact(input);
    if (!isValidContact(message)) {
      throw new BadRequestException('Revisa el nombre, correo y mensaje.');
    }
    await this.repository.saveContact(message);
    return { message: 'Mensaje recibido. Te responderé pronto.' };
  }
}
