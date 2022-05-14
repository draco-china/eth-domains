import fs from 'fs';
import chromedriver from 'chromedriver';
import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const options = new chrome.Options()
options.addArguments("--headless") //!!!should be enabled for Jenkins
options.addArguments("--disable-dev-shm-usage") //!!!should be enabled for Jenkins
options.addArguments("--window-size=1920x1080"); //!!!should be enabled for Jenkins

const findExpirationDate = async (domain) => {
  let expirationDate;
  const url = `https://app.ens.domains/name/${domain}.eth/details`;
  const path = chromedriver.path;
  const service = new chrome.ServiceBuilder(path).build();
  chrome.setDefaultService(service);
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  try {
    await driver.get(url);
    await driver.sleep(7000);
    expirationDate = await driver.findElement(webdriver.By.css('.css-lvyu5j')).getText();
  } catch (error) {
  } finally {
    await driver.quit();
    await service.kill();
    return expirationDate;
  }
}

const findRegister = async (domain) => {
  let year, money;
  const url = `https://app.ens.domains/name/${domain}.eth/register`;

  const path = chromedriver.path;
  const service = new chrome.ServiceBuilder(path).build();
  chrome.setDefaultService(service);
  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  try {
    await driver.get(url);
    await driver.sleep(7000);
    year = await driver.findElement(webdriver.By.css('input[aria-label="year"]')).getAttribute('value');
    money = await driver.findElement(webdriver.By.css('.css-81mxgz')).getText();
  } catch (error) {
  } finally {
    await driver.quit();
    await service.kill();
    return { domain, year, money };
  }
}

const getDomains = async (name) => {
  if (!fs.existsSync('./domains')) fs.mkdirSync('./domains');
  const jsonPath = `./domains/${name}.json`;
  const expirationPath = `./domains/${name}-expiration.text`;
  const registerPath = `./domains/${name}.txt`;
  try {
    fs.unlinkSync(`./domains/${name}-expiration.json`);
    fs.unlinkSync(jsonPath);
    fs.unlinkSync(expirationPath);
    fs.unlinkSync(registerPath);
  } catch (error) {}

  const domains = fs.readFileSync(`./split-words/${name}.txt`, 'utf-8').split('\n');
  let results = [];
  for (let index = 0; index < domains.length; index++) {
    const domain = domains[index];
    const result = await findRegister(domain);
    if (!result.year) {
      result.expirationDate = await findExpirationDate(domain);
      console.log(index, '不可注册域名', result.domain, result.expirationDate);
      fs.writeFileSync(expirationPath, `${result.domain} ${result.expirationDate}年 可注册` + '\n', { flag: 'a' });
    } else {
      console.log(index, '可注册域名', result.domain, result.year, result.money);
      fs.writeFileSync(registerPath, `${result.domain} ${result.year}年 ${result.money} 可注册` + '\n', { flag: 'a' });
    }
    results.push(result);
  }
  fs.writeFileSync(jsonPath, JSON.stringify(results), { flag: 'a' });
  return results;
}

(
  async () => {
    const arg = process.argv.slice(2)[0]
    await getDomains(arg);
  }
)()
