// @ts-check
const {test, expect} = require('@playwright/test');
const assert = require("assert");

test('Upload new avatar image', async ({page}) => {
    test.setTimeout(120000);
    await page.goto('https://playwright.dev/');
    await page.goto('https://welcometothejungle.com');
    //Accept cookies
    await page.locator("//button[@id='axeptio_btn_acceptAll']").click();
    //login
    await page.locator("//header[@id='header']//button[@data-testid='header-user-button-login']").click();
    await page.locator("//input[@data-testid='login-field-email']").fill("inqom.qaautomationapplicant@gmail.com");
    await page.locator("//input[@data-testid='login-field-password']").fill("o5N,d5ZR@R7^");
    await page.locator("//button[@data-testid='login-button-submit']").click();
    // check correct user is connected
    expect(await page.locator("//a[@data-testid='home-connected-user-card-name']/span").textContent()).toEqual("Inqom Inqom");
    //get current avatar src image
    var old_avatar_src = 'img does not exists';
    const avatar = await page.locator("//div[@data-testid='home-connected-user-card-avatar']/img").isVisible();
    if (avatar) {
        old_avatar_src = await page.locator("//div[@data-testid='home-connected-user-card-avatar']/img").getAttribute('src')
    }


    // change avatar image, remove previous avatar if exists
    await page.locator("//a[@data-testid='home-connected-user-card-name']").click();
    const remove_file_button = await page.locator("//div[@data-testid='account-edit-field-avatar']//button[2]").isVisible();
    if (remove_file_button) {
        await page.locator("//div[@data-testid='account-edit-field-avatar']//button[2]").click();
    }
    //submit changes
    await page.locator("//button[@data-testid='account-edit-button-submit']").click();
    await page.waitForTimeout(5000);
    await page.locator("//header[@id='header']//li[@data-testid='menu-home']").click();
    //check old avatar is no longer visible
    assert.equal(await page.locator("//div[@data-testid='home-connected-user-card-avatar']/img").isVisible(), false);

    //upload new avatar
    await page.locator("//a[@data-testid='home-connected-user-card-name']").click();
    await page.screenshot({path: 'before_avatar_selection.png'});
    const handle = await page.locator("//input[@name='avatar' and @type='file']")
    await handle.setInputFiles('resources/tour-eiffel-drapeau-francais.jpg')
    const new_avatar_src = await page.locator("//div[@id='avatar']//img").getAttribute('src')
    await page.waitForTimeout(5000);
    await page.screenshot({path: 'after_avatar.png'});

    //submit changes
    await page.locator("//button[@data-testid='account-edit-button-submit']").click();
    await page.waitForTimeout(5000);
    await page.locator("//header[@id='header']//li[@data-testid='menu-home']").click();

    //check new avatar is visible
    assert.equal(await page.locator("//div[@data-testid='home-connected-user-card-avatar']/img").isVisible(), true);

    // verify the avatar is uploaded to the same location as the previous one
    const account_avatar_src = await page.locator("//div[@data-testid='home-connected-user-card-avatar']/img").getAttribute('src')
    assert.equal(old_avatar_src, account_avatar_src)


    //Disconnect
    await page.locator("//button[@data-testid='header-user-links-toggle']").click();
    await page.locator("//button[@data-testid='header-user-link-signout']").click();

    // await page.waitForTimeout(30000);
    // Expect a title "to contain" a substring.
    // await expect(page).toHaveTitle(/Playwright/);
});