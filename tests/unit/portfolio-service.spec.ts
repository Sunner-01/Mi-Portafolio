import { describe, expect, it, vi } from 'vitest';
import { PortfolioService } from '../../backend/src/application/portfolio.service';
import type { PortfolioRepository } from '../../backend/src/domain/portfolio';

function repository(): PortfolioRepository {
  return {
    getPortfolio: vi.fn(),
    getProject: vi.fn().mockResolvedValue(null),
    saveContact: vi.fn().mockResolvedValue(undefined),
  };
}

describe('servicio de portafolio', () => {
  it('devuelve 404 para un proyecto inexistente', async () => {
    await expect(new PortfolioService(repository()).getProject('no-existe')).rejects.toMatchObject({ status: 404 });
  });

  it('guarda el contacto normalizado', async () => {
    const repo = repository();
    await new PortfolioService(repo).sendContact({ name: '  Ana  ', email: ' ANA@EXAMPLE.COM ', message: '  Quiero trabajar contigo.  ' });
    expect(repo.saveContact).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@example.com', message: 'Quiero trabajar contigo.' });
  });
});
