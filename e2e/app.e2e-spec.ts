import { DocumentsFrontPage } from './app.po';

describe('documents-frontend App', function() {
  let page: DocumentsFrontPage;

  beforeEach(() => {
    page = new DocumentsFrontPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
