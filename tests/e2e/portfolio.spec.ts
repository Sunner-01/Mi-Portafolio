import { expect, test } from '@playwright/test';

test('presenta el perfil personal y los proyectos', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Suner Barrera/);
  await expect(page.getByRole('heading', { name: /Código con/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Sucre Turística/i })).toBeVisible();
});

test('permite recorrer la sección sobre mí', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sobre mí' }).click();
  await expect(page.getByRole('heading', { name: /Hola, soy Suner/i })).toBeVisible();
  await expect(page.getByText(/Universidad del Valle/i).first()).toBeVisible();
});

test('envía un mensaje desde el formulario', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Hablemos/i }).first().click();
  await page.getByLabel('Tu nombre').fill('Ana Pérez');
  await page.getByLabel('Tu correo').fill(`e2e-${Date.now()}@example.com`);
  await page.getByLabel('Mensaje').fill('Quiero conversar sobre una aplicación móvil.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status')).toContainText('Mensaje recibido');
});
