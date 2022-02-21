/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-present eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

const {waitForExtension} = require("../helpers");
const {expect} = require("chai");
const DayOnePage = require("../page-objects/dayOne.page");
const FirstRunPage = require("../page-objects/firstRun.page");
const ProblemPage = require("../page-objects/problem.page");
const UpdatesPage = require("../page-objects/updates.page");
const dayOnePageData =
  require("../test-data/data-page-links").dayOnePageData;
const firstRunPageData =
  require("../test-data/data-page-links").firstRunPageData;
const problemPageData =
  require("../test-data/data-page-links").problemPageData;
const updatesPageData =
  require("../test-data/data-page-links").updatesPageData;
let globalOrigin;

describe("test page links", () =>
{
  beforeEach(async() =>
  {
    const [origin] = await waitForExtension();
    await browser.url(`${origin}/desktop-options.html`);
    globalOrigin = origin;
  });

  afterEach(async() =>
  {
    await browser.reloadSession();
  });

  firstRunPageData.forEach(async(dataSet) =>
  {
    it("should have a link for: " + dataSet.testName, async() =>
    {
      const firstRunPage = new FirstRunPage(browser);
      await firstRunPage.init(globalOrigin);
      await firstRunPage.waitForEnabledThenClick(
        firstRunPage[dataSet.elementToClick]);
      await firstRunPage.switchToTab(dataSet.newTabUrl);
      if (dataSet.newTabUrl != "/options.html")
      {
        expect(await firstRunPage.getCurrentUrl()).to.equal(
          dataSet.newTabUrl);
      }
      else
      {
        expect(await firstRunPage.getCurrentUrl()).to.equal(
          globalOrigin + dataSet.newTabUrl);
      }
    });
  });

  dayOnePageData.forEach(async(dataSet) =>
  {
    it("should have a link for: " + dataSet.testName, async() =>
    {
      const dayOnePage = new DayOnePage(browser);
      await dayOnePage.init(globalOrigin);
      if (dataSet.testName != "Day 1 - Contact us")
      {
        await dayOnePage.waitForEnabledThenClick(
          dayOnePage[dataSet.elementToClick]);
        await dayOnePage.switchToTab(dataSet.newTabUrl);
        expect(await dayOnePage.getCurrentUrl()).to.equal(
          dataSet.newTabUrl);
      }
      else
      {
        expect(await dayOnePage[dataSet.elementToClick].
          getAttribute("href")).to.equal(dataSet.newTabUrl);
      }
    });
  });

  problemPageData.forEach(async(dataSet) =>
  {
    it("should have a link for: " + dataSet.testName, async() =>
    {
      const problemPage = new ProblemPage(browser);
      await problemPage.init(globalOrigin);
      if (dataSet.testName == "Problem - Envelope icon")
      {
        expect(await problemPage[dataSet.elementToClick].
          getAttribute("href")).to.equal(dataSet.newTabUrl);
      }
      else if (dataSet.testName == "Problem - Uninstall and reinstall")
      {
        await problemPage.waitForEnabledThenClick(
          problemPage[dataSet.elementToClick]);
        await problemPage.switchToTab(dataSet.webstoreCookiesConsentPageTitle);
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Enter");
        expect(await problemPage.getCurrentUrl()).to.equal(
          dataSet.newTabUrl);
      }
      else
      {
        await problemPage.waitForEnabledThenClick(
          problemPage[dataSet.elementToClick]);
        await problemPage.switchToTab(dataSet.newTabUrl);
        expect(await problemPage.getCurrentUrl()).to.equal(
          dataSet.newTabUrl);
      }
    });
  });

  updatesPageData.forEach(async(dataSet) =>
  {
    it("should have a link for: " + dataSet.testName, async() =>
    {
      const updatesPage = new UpdatesPage(browser);
      await updatesPage.init(globalOrigin);
      if (dataSet.testName == "Updates - Envelope icon")
      {
        expect(await updatesPage[dataSet.elementToClick].
          getAttribute("href")).to.equal(dataSet.newTabUrl);
      }
      else if (dataSet.testName == "Updates - Rate it")
      {
        await updatesPage.waitForEnabledThenClick(
          updatesPage[dataSet.elementToClick]);
        await updatesPage.switchToTab(dataSet.webstoreCookiesConsentPageTitle);
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Tab");
        await browser.keys("Enter");
        expect(await updatesPage.getCurrentUrl()).to.equal(
          dataSet.newTabUrl);
      }
      else
      {
        await updatesPage.waitForEnabledThenClick(
          updatesPage[dataSet.elementToClick]);
        await updatesPage.switchToTab(dataSet.newTabUrl);
        expect(await updatesPage.getCurrentUrl()).to.include(
          dataSet.newTabUrl);
      }
    });
  });
});
