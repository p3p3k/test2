'use strict';

describe('Portfolis E2E Tests:', function () {
  describe('Test portfolis page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/portfolis');
      expect(element.all(by.repeater('portfoli in portfolis')).count()).toEqual(0);
    });
  });
});
