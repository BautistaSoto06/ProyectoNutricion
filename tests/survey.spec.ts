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

  test('CP-12: Intentar enviar sin completar ningún campo, verificar mensajes de error', async ({ page }) => {
    // Intentar enviar sin completar nada
    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    
    // Verificar que los campos obligatorios son inválidos (validación nativa del navegador)
    const isAgeInvalid = await page.$eval('input[name="age"]', (input: HTMLInputElement) => !input.validity.valid);
    const isFacultyInvalid = await page.$eval('select[name="faculty"]', (input: HTMLSelectElement) => !input.validity.valid);
    const isGenderInvalid = await page.$eval('select[name="gender"]', (input: HTMLSelectElement) => !input.validity.valid);
    
    expect(isAgeInvalid).toBeTruthy();
    expect(isFacultyInvalid).toBeTruthy();
    expect(isGenderInvalid).toBeTruthy();
    
    // Verificar que seguimos en la página de la encuesta
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
  });

  test('CP-13: Completar solo un campo y enviar, verificar mensajes de error', async ({ page }) => {
    // Completar solo la edad
    await page.getByPlaceholder('Ej: 22').fill('25');
    
    // Intentar enviar
    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    
    // Verificar que otros campos obligatorios siguen siendo inválidos
    const isFacultyInvalid = await page.$eval('select[name="faculty"]', (input: HTMLSelectElement) => !input.validity.valid);
    const isGenderInvalid = await page.$eval('select[name="gender"]', (input: HTMLSelectElement) => !input.validity.valid);
    
    expect(isFacultyInvalid).toBeTruthy();
    expect(isGenderInvalid).toBeTruthy();
  });

test('CP-14: Ingresar edad fuera de rango, verificar renderizado de banner React', async ({ page }) => {
  const ageInput = page.getByPlaceholder('Ej: 22');
  const submitButton = page.getByRole('button', { name: 'Enviar Encuesta' });
  const errorBanner = page.locator('.bs-error-banner');

  // Caso 1: Edad por encima del rango
  await ageInput.fill('150');
  await submitButton.click();
  
  await expect(errorBanner).toBeVisible();
  await expect(errorBanner).toContainText('Seleccione una edad dentro del rango permitido (15-99)');

  // Caso 2: Edad por debajo del rango
  // Usamos .fill() de nuevo para reemplazar el valor anterior
  await ageInput.fill('5');
  await submitButton.click();
  
  await expect(errorBanner).toBeVisible();

  // Caso 3: Edad válida
  await ageInput.fill('25');
  await submitButton.click();
  
  // Validamos que React limpie el estado del error y el banner desaparezca del DOM
  await expect(errorBanner).toBeHidden();
});

  test('should allow submitting another response after success', async ({ page }) => {
    // Fill minimum required and submit
    await page.getByPlaceholder('Ej: 22').fill('25');
    await page.locator('select[name="faculty"]').selectOption('ingenieria');
    await page.locator('select[name="gender"]').selectOption('masculino');

    await page.route('/api/v3/encuestas/submit', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'Success' }) });
    });

    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();
    await expect(page.getByRole('heading', { name: '¡Muchas gracias!' })).toBeVisible();

    // Click "Enviar otra respuesta"
    await page.getByRole('button', { name: 'Enviar otra respuesta' }).click();

    // Verificar que la página de encuesta carga correctamente y el campo edad está vacío
    await expect(page.getByRole('heading', { name: 'Evaluación Sensorial' })).toBeVisible();
    await expect(page.getByPlaceholder('Ej: 22')).toHaveValue('');
  });

  test('should show error message on API failure', async ({ page }) => {
    await page.getByPlaceholder('Ej: 22').fill('30');
    await page.locator('select[name="faculty"]').selectOption('ciencias');
    await page.locator('select[name="gender"]').selectOption('femenino');

    // Mock respuesta fallida del servidor
    await page.route('/api/v3/encuestas/submit', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Error de servidor' }),
      });
    });

    await page.getByRole('button', { name: 'Enviar Encuesta' }).click();

    // Verificar que se muestra el mensaje de error
    await expect(page.locator('.bs-error-banner')).toBeVisible();
    await expect(page.locator('.bs-error-banner')).toContainText('Error de servidor');
  });
});

test.describe('Admin Panel', () => {
  test('should show validation error on empty credentials', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    
    const isUserInvalid = await page.$eval('input[placeholder="Ingresá tu usuario"]', (input: HTMLInputElement) => !input.validity.valid);
    expect(isUserInvalid).toBeTruthy();
  });

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
    
    // CP-18, CP-19, CP-20: Verificar títulos de los gráficos específicos
    await expect(page.getByText('Distribución por Sexo')).toBeVisible();
    await expect(page.getByText('Intensidad de Sabores')).toBeVisible();
    await expect(page.getByText('¿Recomendarías el producto?')).toBeVisible();
    
    await expect(page.locator('.recharts-responsive-container')).toHaveCount(9);
  });

  test('should logout and return to login screen', async ({ page }) => {
    await page.goto('/admin');

    // Mock login and dashboard data
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
