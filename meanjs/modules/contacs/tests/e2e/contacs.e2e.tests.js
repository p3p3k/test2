'use strict';

describe('Contacs E2E Tests:', function () {
  describe('Test contacs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/contacs');
      expect(element.all(by.repeater('contac in contacs')).count()).toEqual(0);
    });
  });
});
