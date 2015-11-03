'use strict'

describe 'tLog Controllers', ->
    beforeEach ->
        jasmine.addMatchers
            toEqualData: (util, customEqualityTesters) ->
                compare: (actual, expected) ->
                    result = {}
                    result.pass = angular.equals actual, expected
                    result


    beforeEach ->
        module 'ionic'
        module 'starter.controllers'
        module "starter.services"


    describe 'FriendsCtrl', ->
        $controller = null
        $scope = $httpBackend = $state = null


        beforeEach inject ($rootScope, _$controller_, _$httpBackend_, _$state_) ->
            $scope = $rootScope.$new()
            $controller = _$controller_
            $httpBackend = _$httpBackend_
            $state = _$state_


        it "should setup a list of friends on initialization", ->
            $state.current.name = "tab.trips"
            $controller 'FriendsCtrl', $scope: $scope
            expect($scope.friends.length).toBe 4








