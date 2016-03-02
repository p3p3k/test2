(function () {
  'use strict';

  describe('Portfolis Route Tests', function () {
    // Initialize global variables
    var $scope,
      PortfolisService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PortfolisService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PortfolisService = _PortfolisService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('portfolis');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/portfolis');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          PortfolisController,
          mockPortfoli;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('portfolis.view');
          $templateCache.put('modules/portfolis/client/views/view-portfolis.client.view.html', '');

          // create mock portfoli
          mockPortfoli = new PortfolisService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Portfoli about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          PortfolisController = $controller('PortfolisController as vm', {
            $scope: $scope,
            portfoliResolve: mockPortfoli
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:portfoliId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.portfoliResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            portfoliId: 1
          })).toEqual('/portfolis/1');
        }));

        it('should attach an portfoli to the controller scope', function () {
          expect($scope.vm.portfoli._id).toBe(mockPortfoli._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/portfolis/client/views/view-portfolis.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PortfolisController,
          mockPortfoli;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('portfolis.create');
          $templateCache.put('modules/portfolis/client/views/form-portfolis.client.view.html', '');

          // create mock portfoli
          mockPortfoli = new PortfolisService();

          //Initialize Controller
          PortfolisController = $controller('PortfolisController as vm', {
            $scope: $scope,
            portfoliResolve: mockPortfoli
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.portfoliResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/portfolis/create');
        }));

        it('should attach an portfoli to the controller scope', function () {
          expect($scope.vm.portfoli._id).toBe(mockPortfoli._id);
          expect($scope.vm.portfoli._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/portfolis/client/views/form-portfolis.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PortfolisController,
          mockPortfoli;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('portfolis.edit');
          $templateCache.put('modules/portfolis/client/views/form-portfolis.client.view.html', '');

          // create mock portfoli
          mockPortfoli = new PortfolisService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Portfoli about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          PortfolisController = $controller('PortfolisController as vm', {
            $scope: $scope,
            portfoliResolve: mockPortfoli
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:portfoliId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.portfoliResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            portfoliId: 1
          })).toEqual('/portfolis/1/edit');
        }));

        it('should attach an portfoli to the controller scope', function () {
          expect($scope.vm.portfoli._id).toBe(mockPortfoli._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/portfolis/client/views/form-portfolis.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
