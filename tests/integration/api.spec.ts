import 'reflect-metadata';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createClient } from '@supabase/supabase-js';
import { AppModule } from '../../backend/src/app.module';

config({ quiet: true });

describe('API y Supabase local', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => { await app?.close(); });

  it('expone una respuesta de salud', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
  });

  it('lee el perfil y los tres proyectos desde Supabase', async () => {
    const response = await request(app.getHttpServer()).get('/portfolio').expect(200);
    expect(response.body.profile.name).toBe('Suner Barrera');
    expect(response.body.projects).toHaveLength(3);
    expect(response.body.skills.length).toBeGreaterThanOrEqual(3);
  });

  it('encuentra un proyecto por su slug', async () => {
    const response = await request(app.getHttpServer()).get('/projects/vixor').expect(200);
    expect(response.body.name).toBe('Vixor');
  });

  it('guarda un mensaje en Supabase', async () => {
    const email = `integration-${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/contacts')
      .send({ name: 'Ana Pérez', email, message: 'Quiero conversar sobre un proyecto web.' })
      .expect(201);
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data, error } = await client.from('contact_messages').select('name').eq('email', email).single();
    expect(error).toBeNull();
    expect(data?.name).toBe('Ana Pérez');
  });

  it('rechaza un correo inválido', async () => {
    await request(app.getHttpServer())
      .post('/contacts')
      .send({ name: 'Ana Pérez', email: 'incorrecto', message: 'Quiero conversar sobre un proyecto web.' })
      .expect(400);
  });
});
