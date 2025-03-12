// const puppeteer = require('puppeteer');
import puppeteer from "puppeteer";
let name;
async function parseRecentAC(username) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(`https://leetcode.com/u/${username}/`, { waitUntil: 'networkidle2'});
        const name = await page.evaluate(() => {
            return document.querySelector("div.text-label-1.dark\\:text-dark-label-1.break-all.text-base.font-semibold").textContent
        })
        console.log(name);
        const completeProblem = await page.evaluate(()=>{
            const comPrloblems = document.querySelectorAll("div.flex.h-full.w-\\[90px\\].flex-none.flex-col.gap-2 div")
            const problems = {};
            comPrloblems.forEach((pipa)=>{
                let complexity = pipa.querySelector("div.text-xs")?.textContent ;
                let comProb = pipa.querySelector("div.text-sd-foreground")?.textContent.split("/")[0];
                problems[complexity === "Med."?"Medium":complexity] = comProb;
            })
            return problems
        });
        console.log(completeProblem)
        const recentAC = await page.evaluate(() => {
            const tasks = [];
            const taskElements = document.querySelectorAll('div.flex.flex-col a[target="_blank"]');
            taskElements.forEach(task => {
                const title = task.querySelector('span.text-label-1')?.textContent.trim();
                const date = task.querySelector('span.text-label-3')?.textContent.trim();
                const link = task.href;
                tasks.push({ title, date, link });
            });
            return tasks;
        });
        console.log(recentAC);
        return {
            Name: name,
            CountProblems: completeProblem,
            RecentAC: recentAC
        }
    } catch (error) {
        console.error('Ошибка при парсинге:', error);
    } finally {
        await browser.close();
    }
}
const e = parseRecentAC('elesm')