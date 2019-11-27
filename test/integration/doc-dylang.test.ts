// Adapter from axe-webdriverjs.
// This test tests to make sure that a valid configuration works.

import { expect } from 'chai'
import Puppeteer from 'puppeteer'
import AxePuppeteer from '../../src/index'

describe('doc-dylang.html', () => {
  let page: Puppeteer.Page
  let browser: Puppeteer.Browser

  before(async function() {
    this.timeout(10000)

    const args = []
    if (process.env.CI) {
      args.push('--no-sandbox', '--disable-setuid-sandbox')
    }
    browser = await Puppeteer.launch({ args })
  })
  after(async () => {
    await browser.close()
  })
  beforeEach(async () => {
    page = await browser.newPage()
  })

  afterEach(async () => {
    await page.close()
  })

  it('stack overflow test', async () => {
    await page.goto('https://www.stackoverflow.com')

    await page.setViewport({
      height: 1080,
      width: 1920
    })

    const results = await new AxePuppeteer(page).analyze()

    const colorContrastIssues = results.violations.filter(
      v => v.id === 'color-contrast'
    )[0]

    expect(colorContrastIssues.nodes).to.have.lengthOf(
      47,
      'Color contrast issues count should be 47'
    )

    // console.log("Results: ", colorContrastIssues);
  })

  // it('should find violations with customized helpUrl', async function() {
  //   const file = fixtureFilePath('doc-dylang.html')
  //   const config = await customConfig()

  //   await this.page.goto(`file://${file}`)

  //   const results = await new AxePuppeteer(this.page)
  //     .configure(config)
  //     .withRules(['dylang'])
  //     .analyze()

  //   expect(results.violations).to.have.lengthOf(1)
  //   expect(results.violations[0].id).to.eql('dylang')
  //   expect(
  //     results.violations[0].helpUrl.indexOf(
  //       'application=axe-puppeteer'
  //     )
  //   ).to.not.eql(-1)
  //   expect(results.passes).to.have.lengthOf(0)
  // })
})
