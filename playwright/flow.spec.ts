import { test, expect } from '@playwright/test';

test.describe('Dọn Nè Critical Public & Lead Flow', () => {
  test('Homepage loads correctly and has Dọn Nè brand & hotlines', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Dọn Nè/);
    await expect(page.locator('body')).toContainText('DỌN NÈ');
    await expect(page.locator('body')).toContainText('0964.182.330');
  });

  test('Open quote modal and submit with attribution preserved', async ({ page }) => {
    await page.goto('/?utm_source=test-campaign&utm_medium=cpc');
    await page.getByRole('button', { name: /Nhận Báo Giá/i }).first().click();
    await expect(page.getByText('Nhận Báo Giá Dọn Nè Trọn Gói')).toBeVisible();

    await page.getByPlaceholder(/Anh \/ Chị/i).fill('Khách Hàng Test');
    await page.getByPlaceholder(/09xx/i).fill('0964182330');
    await page.getByRole('button', { name: /GỬI YÊU CẦU/i }).click();

    await expect(page).toHaveURL(/\/cam-on/);
    await expect(page.locator('body')).toContainText('Cảm Ơn Quý Khách');
  });
});
