/*
 ============================================================================
 Name        : LoginCounterTests.js
 Copyright   : Edges For Training
 Description : This file contains Selenium test cases for the login functionality and counter 
               functionality of a web application. Tests cover login validations, error 
               handling, and counter operations (increment, decrement).
 ============================================================================
 */

 import { Builder, By, Key, until } from 'selenium-webdriver';
 import { expect } from 'chai';

 let credentials = {
    username: "admin",
    password: "admin123"
 }

 let driver;
 const url = 'http://localhost:3000'; // Replace with your app's URL

 describe ('Login Page', function() {
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('TC1, Blank Username',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//li[text()='Login']")).click();
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Password']")), 5000)
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(credentials.password);
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        let errorElement = await driver.wait(until.elementLocated(By.className('error')), 5000);
        let errorText = await errorElement.getText();
        expect(errorText).to.equal('Username field is required!')
    })

    it('Test Case 2, Blank Password',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//li[text()='Login']")).click();
        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Username']")), 5000)
        await driver.findElement(By.xpath("//input[@type='text']")).sendKeys(credentials.username);
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).click("");
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        let errorElement = await driver.wait(until.elementLocated(By.className('error')), 5000);
        let errorText = await errorElement.getText();
        expect(errorText).to.equal('Password field is required!')
    })

    it('TC3, UserName < 3',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//li[text()='Login']")).click();
        await driver.wait(until.elementLocated(By.xpath("//input[@type='text']")), 5000)
        await driver.findElement(By.xpath("//input[@type='text']")).sendKeys("ad");
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(credentials.password);
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        let errorElement = await driver.wait(until.elementLocated(By.className('error')), 5000);
        let errorText = await errorElement.getText();
        expect(errorText).to.equal('Username field must be at least 3 characters')
    })

    it('TC4, Password < 8',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//li[text()='Login']")).click();
        await driver.wait(until.elementLocated(By.xpath("//li[text()='Login']")), 5000)
        await driver.findElement(By.xpath("//input[@type='text']")).sendKeys(credentials.username);
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("1234567");
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        let errorElement = await driver.wait(until.elementLocated(By.className('error')), 5000);
        let errorText = await errorElement.getText();
        expect(errorText).to.equal('Password must be at least 8 characters long!')
    })

    it('TC5, UserName & Password are Invalid',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//li[text()='Login']")).click();
        await driver.wait(until.elementLocated(By.xpath("//li[text()='Login']")), 5000)
        await driver.findElement(By.xpath("//input[@type='text']")).sendKeys("Adminn");
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys("Adminn");
        await driver.findElement(By.xpath("//button[text()='Login']")).click();

        let errorElement = await driver.wait(until.elementLocated(By.className('error')), 5000);
        let errorText = await errorElement.getText();
        expect(errorText).to.equal('Password must be at least 8 characters long!')
    })

    after(async function () {
        await driver.quit();
    })
}
)

describe ('View Post Page', function() {
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    it('TC1, Ensure that the comment is Posted',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//button[text()='View Post']")).click();
        await driver.wait(until.elementLocated(By.xpath("//textarea[@placeholder='Add a comment...']")), 5000)

        await driver.findElement(By.xpath("//textarea[@placeholder='Add a comment...']")).sendKeys("Test Comment");
        await driver.findElement(By.xpath("//button[text()='Comment']")).click();
        
        let CommentElement = await driver.wait(until.elementLocated(By.xpath("//div[@class='comment']")), 5000);
        let CommentText = await CommentElement.getText();

        expect(CommentText).to.include("Test Comment")
    })

    it('TC2, Ensure that the <First post> is viewed',async () => {
        await driver.get(`${url}/`);
        let FirstPostElement = await driver.findElement(By.xpath("//h2[text()='First Blog Post']"))
        let FirstPostText    = await FirstPostElement.getText();

        await driver.findElement(By.xpath("//button[text()='View Post']")).click();
        await driver.wait(until.elementLocated(By.xpath("//h2[text()='First Blog Post']")), 5000)
        let FirstPostElement1 = await driver.findElement(By.xpath("//h2[text()='First Blog Post']"))
        let FirstPostText1    = await FirstPostElement1.getText();

        expect(FirstPostText1).to.equal(FirstPostText)
    })

    it('TC3, Ensure that the Reply is Posted',async () => {
        await driver.get(`${url}/`);
        await driver.findElement(By.xpath("//button[text()='View Post']")).click();
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Reply']")), 5000)
        await driver.findElement(By.xpath("//button[text()='Reply']")).click();
        await driver.findElement(By.xpath("//textarea[@placeholder='Write a reply...']")).sendKeys("Test Reply");
        await driver.findElement(By.xpath("//div[@class='reply-box']//button[text()='Reply']")).click();
        
        let ReplyElement = await driver.wait(until.elementLocated(By.xpath("//div[@class='replies']/p[2]")),5000);        
        let ReplyText    = await ReplyElement.getText();
        expect(ReplyText).to.include("Test Reply")
    })

    after(async function () {
        await driver.quit();
    })
}
)