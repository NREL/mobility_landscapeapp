
import puppeteer from "puppeteer";
require('expect-puppeteer');
import { paramCase } from 'change-case';
import { settings } from '../tools/settings';
import { projects } from '../tools/loadData';
import { landscapeSettingsList } from "../src/utils/landscapeSettings";

const devicesMap = puppeteer.devices;
const prefix = process.env.ROUTE_BASE || '';
const port = process.env.PORT || '4000';
const appUrl = `http://localhost:${port}/${prefix}`;
const width = 1920;
const height = 1080;
console.log("Connecting to URL "+appUrl+" at "+width+" x "+ height);

let setup;
let browser;
let page;
let close = () => test('Closing a browser', async () => await browser.close());

expect.extend({
  async toHaveElement(page, selectorOrXpath) {
    const method = selectorOrXpath.slice(0, 2) === '//' ? '$x' : '$$';
    const elements = await page[method](selectorOrXpath);
    const pass = elements.length > 0;
    const message = () => {
      return `Element "${selectorOrXpath}" ${this.isNot ? "was not supposed to" : "could not"} be found.`
    };
    return { pass, message };
  },
})

jest.setTimeout(process.env.SHOW_BROWSER ? 30000 : 20000);

async function makePage(initialUrl) {
  try {
    browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: !process.env.SHOW_BROWSER});
    const page = await browser.newPage();
    await setup(page);
    await page.goto(initialUrl);
    return page;
  } catch(ex) {
    try {
      console.info('retrying...', ex);
      browser.close();
    } catch(ex2) {

    }
    return await makePage(initialUrl);
  }
}

function embedTest() {
  describe("Embed test", () => {
    describe("I visit an example embed page", () => {
      let frame;
      test('page is open and has a frame', async function(){
        page = await makePage(appUrl + '/embed.html');
        frame = await page.frames()[1];
        await frame.waitForXPath(`//h1[contains(text(), 'full interactive landscape')]`);
      });

      test('Do not see a content from a main mode', async function() {
        await expect(frame).not.toHaveElement(`//h1[text() = '${settings.test.header}']`);
      });

      // ensure that it is clickable
      test('I can click on a tile in a frame and I get a modal after that', async function() {
        await expect(frame).toHaveElement(`.mosaic img`);
        await frame.click(`.mosaic img`);
        await frame.waitForSelector(".modal-content");
      });
      close();
    }, 6 * 60 * 1000); //give it up to 1 min to execute
  });
}

function mainTest() {
  describe("Main test", () => {
    describe("I visit a main page and have all required elements", () => {
      test('I can open a page', async function() {
        page = await makePage(appUrl + '/format=card-mode');
        await page.waitFor('.cards-section');
      });

      //header
      test('A proper header is present', async function() {
        await expect(page).toHaveElement(`//h1[text() = '${settings.test.header}']`);
      });
      test('Group headers are ok', async function() {
        await expect(page).toHaveElement(`//a[contains(text(), '${settings.test.section}')]`);
      });
      test('I see a You are viewing text', async function() {
        await expect(page).toHaveElement(`//*[contains(text(), 'You are viewing ')]`);
      });
      test(`A proper card is present`, async function() {
        await expect(page).toHaveElement(`.mosaic img[src='logos/${settings.test.logo}']`);
      });
      test(`If I click on a card, I see a modal dialog`, async function() {
        await page.click(`.mosaic img[src='logos/${settings.test.logo}']`);
        await page.waitForSelector(".modal-content");
      });
      close();
    }, 6 * 60 * 1000); //give it up to 1 min to execute
  });
}

function landscapeTest() {
  describe("Big Picture Test", () => {
    describe("I visit a main landscape page and have all required elements", () => {
      test('I open a landscape page and wait for it to load', async function() {
        page = await makePage(appUrl);
        await page.waitForSelector('.big-picture-section');
      });
      test('When I click on an item the modal is open', async function() {
        await page.click('.big-picture-section img[src]');
        await page.waitForSelector(".modal-content");
      });

      // and check that without redirect it works too
      test('If I would straight open the url with a selected id, a modal appears', async function() {
        await page.goto(appUrl);
        await page.waitForSelector('.big-picture-section');
        await page.click('.big-picture-section img[src]');
        await page.waitForSelector(".modal-content");
      });
      close();
    }, 6 * 60 * 1000); //give it up to 1 min to execute
  });
  landscapeSettingsList.slice(1).forEach(({ name, url }) => {
    test(`I visit ${name} landscape page and have all required elements, elemens are clickable`, async () => {
      const page = await makePage(`${appUrl}/format=${url}`);
      await page.waitForSelector('.big-picture-section');
      await page.click('.big-picture-section img[src]');
      await page.waitForSelector(".modal-content");
    }, 6 * 60 * 1000); //give it up to 1 min to execute
    close();
  })
}

describe("Normal browser", function() {
  beforeAll(async function() {
    setup = async (page) =>  await page.setViewport({ width, height });
  })
  mainTest();
  landscapeTest();
  embedTest();

  describe("Filtering by privacy", () => {
    const project = projects[0];
    const privacySlug = paramCase(project.privacy);
    const otherProject = projects.find(({ privacy }) => privacy.toLowerCase() !== project.privacy.toLowerCase());
    const otherPrivacySlug = paramCase(otherProject.privacy);

    test(`Checking we see ${project.name} when filtering by privacy ${project.privacy}`, async function() {
      page = await makePage(`${appUrl}/privacy=${privacySlug}&format=card-mode`);
      await expect(page).toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    test(`Checking we don't see ${project.name} when filtering by privacy ${otherProject.privacy}`, async function() {
      await page.goto(`${appUrl}/privacy=${otherPrivacySlug}&format=card-mode`);
      await expect(page).not.toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    close();
  }, 6 * 60 * 1000);
});

describe("Normal browser", function() {
  beforeAll(async function() {
    setup = async (page) =>  await page.setViewport({ width, height });
  })
  mainTest();
  landscapeTest();
  embedTest();

  describe("Filtering by geo_scope", () => {
    const project = projects[0];
    const geo_scopeSlug = paramCase(project.geo_scope);
    const otherProject = projects.find(({ geo_scope }) => geo_scope.toLowerCase() !== project.geo_scope.toLowerCase());
    const othergeo_scopeSlug = paramCase(otherProject.geo_scope);

    test(`Checking we see ${project.name} when filtering by geo_scope ${project.geo_scope}`, async function() {
      page = await makePage(`${appUrl}/geo_scope=${geo_scopeSlug}&format=card-mode`);
      await expect(page).toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    test(`Checking we don't see ${project.name} when filtering by geo_scope ${otherProject.geo_scope}`, async function() {
      await page.goto(`${appUrl}/geo_scope=${othergeo_scopeSlug}&format=card-mode`);
      await expect(page).not.toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    close();
  }, 6 * 60 * 1000);
});

describe("Normal browser", function() {
  beforeAll(async function() {
    setup = async (page) =>  await page.setViewport({ width, height });
  })
  mainTest();
  landscapeTest();
  embedTest();

  describe("Filtering by data_duration", () => {
    const project = projects[0];
    const data_durationSlug = paramCase(project.data_duration);
    const otherProject = projects.find(({ data_duration }) => data_duration.toLowerCase() !== project.data_duration.toLowerCase());
    const otherdata_durationSlug = paramCase(otherProject.data_duration);

    test(`Checking we see ${project.name} when filtering by data_duration ${project.data_duration}`, async function() {
      page = await makePage(`${appUrl}/data_duration=${data_durationSlug}&format=card-mode`);
      await expect(page).toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    test(`Checking we don't see ${project.name} when filtering by data_duration ${otherProject.data_duration}`, async function() {
      await page.goto(`${appUrl}/data_duration=${otherdata_durationSlug}&format=card-mode`);
      await expect(page).not.toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    close();
  }, 6 * 60 * 1000);
});

describe("Normal browser", function() {
  beforeAll(async function() {
    setup = async (page) =>  await page.setViewport({ width, height });
  })
  mainTest();
  landscapeTest();
  embedTest();

  describe("Filtering by data_frequency", () => {
    const project = projects[0];
    const data_frequencySlug = paramCase(project.data_frequency);
    const otherProject = projects.find(({ data_frequency }) => data_frequency.toLowerCase() !== project.data_frequency.toLowerCase());
    const otherdata_frequencySlug = paramCase(otherProject.data_frequency);

    test(`Checking we see ${project.name} when filtering by data_frequency ${project.data_frequency}`, async function() {
      page = await makePage(`${appUrl}/data_frequency=${data_frequencySlug}&format=card-mode`);
      await expect(page).toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    test(`Checking we don't see ${project.name} when filtering by data_frequency ${otherProject.data_frequency}`, async function() {
      await page.goto(`${appUrl}/data_frequency=${otherdata_frequencySlug}&format=card-mode`);
      await expect(page).not.toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    close();
  }, 6 * 60 * 1000);
});

describe("Normal browser", function() {
  beforeAll(async function() {
    setup = async (page) =>  await page.setViewport({ width, height });
  })
  mainTest();
  landscapeTest();
  embedTest();

  describe("Filtering by data_format", () => {
    const project = projects[0];
    const data_formatSlug = paramCase(project.data_format);
    const otherProject = projects.find(({ data_format }) => data_format.toLowerCase() !== project.data_format.toLowerCase());
    const otherdata_formatSlug = paramCase(otherProject.data_format);

    test(`Checking we see ${project.name} when filtering by data_format ${project.data_format}`, async function() {
      page = await makePage(`${appUrl}/data_format=${data_formatSlug}&format=card-mode`);
      await expect(page).toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    test(`Checking we don't see ${project.name} when filtering by data_format ${otherProject.data_format}`, async function() {
      await page.goto(`${appUrl}/data_format=${otherdata_formatSlug}&format=card-mode`);
      await expect(page).not.toHaveElement(`//div[contains(@class, 'mosaic')]//*[text()='${project.name}']`);
    });
    close();
  }, 6 * 60 * 1000);
});

describe("iPhone simulator", function() {
  beforeAll(async function() {
    setup = async (page) => await page.emulate(devicesMap['iPhone X'])
  })
  mainTest();
  landscapeTest();
});
