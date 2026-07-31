const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", executablePath: "C:\\Users\\Vjay\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe" });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  console.log('Navigating to dashboard...');
  await page.goto('http://localhost:8081/student/dashboard.html', { waitUntil: 'networkidle0' });
  
  console.log('Navigating to book appointment...');
  await page.goto('http://localhost:8081/student/book-appointment.html', { waitUntil: 'networkidle0' });
  
  console.log('Navigating to resources...');
  await page.goto('http://localhost:8081/student/resources.html', { waitUntil: 'networkidle0' });

  await browser.close();
})();
