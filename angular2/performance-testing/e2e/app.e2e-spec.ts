import { PerformanceTestingPage } from './app.po';

describe('performance-testing App', () => {
  let page: PerformanceTestingPage;

  beforeEach(() => {
    page = new PerformanceTestingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
