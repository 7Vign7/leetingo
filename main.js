// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";

async function parseRecentAC(username) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(`https://leetcode.com/u/${username}/`, { waitUntil: 'networkidle2'});
        await page.waitForSelector('div.flex.flex-col');
        const recentAC = await page.evaluate(() => {
            const tasks = [];
            const taskElements = document.querySelectorAll('div.flex.flex-col a[target="_blank"]');
            taskElements.forEach(task => {
                const title = task.querySelector('span.text-label-1')?.textContent.trim();
                const date = task.querySelector('span.text-label-3')?.textContent.trim();
                const link = task.href;
                if (title && date && link) {
                    tasks.push({ title, date, link });
                }
            });
            return tasks;
        });
        console.log(recentAC);
    } catch (error) {
        console.error('Ошибка при парсинге:', error);
    } finally {
        await browser.close();
    }
}
parseRecentAC('elesm');