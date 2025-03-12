import puppeteer from "puppeteer";
async function parseRecentAC(username) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setViewport({ width: 1280, height: 800 });
        await page.goto(`https://leetcode.com/u/${username}/`, { waitUntil: 'networkidle2'});
        const infoUser = await page.evaluate(()=>{
            const name = document.querySelector("div.text-label-1.dark\\:text-dark-label-1.break-all.text-base.font-semibold").textContent
            const solvedProblems = document.querySelectorAll("div.flex.h-full.w-\\[90px\\].flex-none.flex-col.gap-2 div");
            const taskElements = document.querySelectorAll('div.flex.flex-col a[target="_blank"]');
            const problems = {};
            const tasks = [];
            solvedProblems.forEach((problem)=>{
                let complexity = problem.querySelector("div.text-xs")?.textContent ;
                let comProb = problem.querySelector("div.text-sd-foreground")?.textContent.split("/")[0];
                problems[complexity === "Med."?"Medium":complexity] = comProb;
            })
            taskElements.forEach(task => {
                const title = task.querySelector('span.text-label-1')?.textContent.trim();
                const date = task.querySelector('span.text-label-3')?.textContent.trim();
                const link = task.href;
                tasks.push({ title, date, link });
            });
            return {
                Name: name,
                CountProblems: problems,
                RecentAC: tasks
            }
        })
        return infoUser
    } catch (error) {
        console.error('Ошибка при парсинге:', error);
    } finally {
        await browser.close();
    }
}
parseRecentAC('elesm')

