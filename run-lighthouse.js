import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher'; // Import launch directly
import fs from 'fs/promises'; // Use promises for fs operations

async function runLighthouse(url) {
    // Launch Chrome in headless mode
    const chrome = await launch({ chromeFlags: ['--headless'] });

    const options = {
        logLevel: 'info',
        output: 'html', // Generates an HTML report
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
    };

    // Run Lighthouse
    const runnerResult = await lighthouse(url, options);

    // Extract Lighthouse scores
    const scores = {
        performance: runnerResult.lhr.categories.performance.score * 100,
        accessibility: runnerResult.lhr.categories.accessibility.score * 100,
        'best-practices': runnerResult.lhr.categories['best-practices'].score * 100,
        seo: runnerResult.lhr.categories.seo.score * 100,
    };

    console.log('Lighthouse scores:', scores);

    // Save the report to a file
    await fs.writeFile('lighthouse-report.html', runnerResult.report);

    console.log('Lighthouse report saved as "lighthouse-report.html"');

    // Close Chrome
    await chrome.kill();
}

// Replace with your local server's URL
const appUrl = 'http://localhost:3000';

runLighthouse(appUrl).catch((error) => {
    console.error('Error running Lighthouse:', error);
});
