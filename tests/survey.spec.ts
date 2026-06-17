import { test, expect } from '@playwright/test';

test.describe('Brownie Survey', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page where the survey is
    await page.goto('/');
  });

  test('should display the survey title and main elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
    await expect(page.getByText('Sin Tacc ● Natural ● Delicioso')).toBeVisible();
    await expect(page.locator('img[alt="Logo"]')).toBeVisible();
  });

  test('should fill and submit the full survey successfully', async ({ page }) => {
    // 1. Datos Generales
    await page.getByPlaceholder('Ej: 22').fill('24');
    await page.locator('select[name="faculty"]').selectOption('ingenieria');
    await page.locator('select[name="gender"]').selectOption('masculino');

    // 2. Atributos Descriptivos (Sliders)
    // We can use the slider inputs directly
    await page.locator('input[name="desc_odor"]').fill('8');
    await page.locator('input[name="desc_aroma"]').fill('7');
    await page.locator('input[name="desc_sweetness"]').fill('5');
    await page.locator('input[name="desc_texture"]').fill('9');

    // 3. Intensidad de Sabores (Sliders)
    await page.locator('input[name="intensity_banana"]').fill('6');
    await page.locator('input[name="intensity_chocolate"]').fill('10');
    await page.locator('input[name="intensity_garbanzo"]').fill('2');
    await page.locator('input[name="intensity_carrot"]').fill('4');

    // 4. Recomendación y Comentarios (Chips and Text)
    await page.getByRole('button', { name: 'Sí', exact: true }).click();
    await page.getByRole('button', { name: '$1.500 – $2.000' }).click();
    await page.locator('input[name="why_recommend"]').fill('Excelente sabor y textura');
    await page.locator('textarea[name="comments"]').fill('Me encantó el brownie');

    // Mock the API response
    await page.route('/api/v3/encuestas/submit', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' }),
      });
    });

    // Submit
    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();

    // Verify success message
    await expect(page.getByRole('heading', { name: '¡Muchas gracias!' })).toBeVisible();
    await expect(page.getByText('Tu opinión nos ayuda a mejorar')).toBeVisible();
  });

  test('should show browser validation errors for mandatory fields', async ({ page }) => {
    // Try to submit without filling anything
    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    
    // Check if we are still on the survey page (didn't submit)
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
    
    // Fill only age and try again
    await page.getByPlaceholder('Ej: 22').fill('22');
    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
  });

  test('should allow submitting another response after success', async ({ page }) => {
    // Fill minimum required and submit
    await page.getByPlaceholder('Ej: 22').fill('25');
    await page.locator('select[name="faculty"]').selectOption('ciencias');
    await page.locator('select[name="gender"]').selectOption('femenino');

    await page.route('/api/v3/encuestas/submit', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Success' }) });
    });

    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    await expect(page.getByRole('heading', { name: '¡Muchas gracias!' })).toBeVisible();

    // Click "Enviar otra respuesta"
    await page.getByRole('button', { name: 'Enviar otra respuesta' }).click();

    // Verify we are back at the beginning
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
    await expect(page.getByPlaceholder('Ej: 22')).toHaveValue('');
  });

  test('should show error message on API failure', async ({ page }) => {
    await page.getByPlaceholder('Ej: 22').fill('30');
    await page.locator('select[name="faculty"]').selectOption('ciencias');
    await page.locator('select[name="gender"]').selectOption('femenino');

    // Mock a failed API response
    await page.route('/api/v3/encuestas/submit', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Error de servidor' }),
      });
    });

    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();

    // Verify error banner
    await expect(page.locator('.bs-error-banner')).toBeVisible();
    await expect(page.locator('.bs-error-banner')).toContainText('Error de servidor');
  });
});

test.describe('Admin Panel', () => {
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/admin');
    
    await page.getByPlaceholder('Ingresá tu usuario').fill('wrong');
    await page.getByPlaceholder('Ingresá tu contraseña').fill('wrong');

    await page.route('/api/v3/admin/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciales inválidas' }),
      });
    });

    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page.locator('.lgn-error')).toBeVisible();
    await expect(page.locator('.lgn-error')).toContainText('Credenciales inválidas');
  });

  test('should login successfully and display the dashboard with charts', async ({ page }) => {
    await page.goto('/admin');

    // 1. Login
    await page.getByPlaceholder('Ingresá tu usuario').fill('admin');
    await page.getByPlaceholder('Ingresá tu contraseña').fill('admin123');

    await page.route('/api/v3/admin/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token' }),
      });
    });

    // Mock dashboard data
    await page.route('/api/v3/encuestas/data', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1, age: 25, gender: 'masculino', faculty: 'ingenieria',
              wouldRecommend: true, priceRange: '$1.500 – $2.000',
              descOdor: 8, descAroma: 7, descSweetness: 6, descTexture: 9,
              intensityBanana: 5, intensityChocolate: 10, intensityGarbanzo: 2, intensityCarrot: 3,
              whyRecommend: 'Rico', comments: 'Ninguno'
            }
          ]
        }),
      });
    });

    await page.getByRole('button', { name: 'Ingresar' }).click();

    // 2. Dashboard Verification
    await expect(page.getByText('Panel de Administración')).toBeVisible();
    await expect(page.locator('.adm-total-badge')).toContainText('1 respuestas totales');
    
    // Verify some charts are rendered (Recharts uses svg)
    await expect(page.locator('.recharts-responsive-container')).toHaveCount(8);
    await expect(page.getByText('Distribución por Edad')).toBeVisible();
    await expect(page.getByText('Intensidad de Sabores')).toBeVisible();
  });

  test('should logout and return to login screen', async ({ page }) => {
    await page.goto('/admin');

    // Mock successful login and data to reach dashboard
    await page.route('/api/v3/admin/login', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ token: 'mock-token' }) });
    });
    await page.route('/api/v3/encuestas/data', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) });
    });

    await page.getByPlaceholder('Ingresá tu usuario').fill('adminNutricion');
    await page.getByPlaceholder('Ingresá tu contraseña').fill('Nutricion123');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    // Verify dashboard
    await expect(page.locator('.adm-logout-btn')).toBeVisible();

    // Logout
    await page.click('.adm-logout-btn');

    // Verify login screen
    await expect(page.getByPlaceholder('Ingresá tu usuario')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  });
});
