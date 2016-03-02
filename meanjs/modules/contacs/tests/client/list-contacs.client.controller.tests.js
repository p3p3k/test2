(function () {
  'use strict';

  describe('Contacs List Controller Tests', function () {
    // Initialize global variables
    var ContacsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ContacsService,
      mockContac;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ContacsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ContacsService = _ContacsService_;

      // create mock contac
      mockContac = new ContacsService({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Contac about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Contacs List controller.
      ContacsListController = $controller('ContacsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockContacList;

      beforeEach(function () {
        mockContacList = [mockContac, mockContac];
      });

      it('should send a GET request and return all contacs', inject(function (ContacsService) {
        // Set POST response
        $httpBackend.expectGET('api/contacs').respond(mockContacList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.contacs.length).toEqual(2);
        expect($scope.vm.contacs[0]).toEqual(mockContac);
        expect($scope.vm.contacs[1]).toEqual(mockContac);

      }));
    });
  });
})();
