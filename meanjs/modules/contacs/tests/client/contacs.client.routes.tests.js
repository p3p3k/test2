(function () {
  'use strict';

  describe('Contacs Route Tests', function () {
    // Initialize global variables
    var $scope,
      ContacsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ContacsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ContacsService = _ContacsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('contacs');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/contacs');
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
          ContacsController,
          mockContac;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('contacs.view');
          $templateCache.put('modules/contacs/client/views/view-contacs.client.view.html', '');

          // create mock contac
          mockContac = new ContacsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Contac about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          ContacsController = $controller('ContacsController as vm', {
            $scope: $scope,
            contacResolve: mockContac
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:contacId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.contacResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            contacId: 1
          })).toEqual('/contacs/1');
        }));

        it('should attach an contac to the controller scope', function () {
          expect($scope.vm.contac._id).toBe(mockContac._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/contacs/client/views/view-contacs.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ContacsController,
          mockContac;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('contacs.create');
          $templateCache.put('modules/contacs/client/views/form-contacs.client.view.html', '');

          // create mock contac
          mockContac = new ContacsService();

          //Initialize Controller
          ContacsController = $controller('ContacsController as vm', {
            $scope: $scope,
            contacResolve: mockContac
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.contacResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/contacs/create');
        }));

        it('should attach an contac to the controller scope', function () {
          expect($scope.vm.contac._id).toBe(mockContac._id);
          expect($scope.vm.contac._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/contacs/client/views/form-contacs.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ContacsController,
          mockContac;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('contacs.edit');
          $templateCache.put('modules/contacs/client/views/form-contacs.client.view.html', '');

          // create mock contac
          mockContac = new ContacsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Contac about MEAN',
            content: 'MEAN rocks!'
          });

          //Initialize Controller
          ContacsController = $controller('ContacsController as vm', {
            $scope: $scope,
            contacResolve: mockContac
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:contacId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.contacResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            contacId: 1
          })).toEqual('/contacs/1/edit');
        }));

        it('should attach an contac to the controller scope', function () {
          expect($scope.vm.contac._id).toBe(mockContac._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/contacs/client/views/form-contacs.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
