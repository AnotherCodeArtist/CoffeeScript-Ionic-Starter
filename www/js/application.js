angular.module("starter", ["ionic", "starter.controllers", "starter.services", "navigation.controllers", "navigation.directives"]).run(["$ionicPlatform", function($ionicPlatform) {
  return $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      return StatusBar.styleDefault();
    }
  });
}]).config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("tab", {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  }).state("tab.dash", {
    url: "/dash",
    views: {
      "tab-dash": {
        templateUrl: "templates/tab-dash.html",
        controller: "DashCtrl"
      }
    }
  }).state("tab.friends", {
    url: "/friends",
    views: {
      "tab-friends": {
        templateUrl: "templates/tab-friends.html",
        controller: "FriendsCtrl"
      }
    }
  }).state("tab.addfriend", {
    url: "/addfriend",
    views: {
      "tab-friends": {
        templateUrl: "templates/add-friend.html",
        controller: "AddFriendCtrl"
      }
    }
  }).state("tab.friend-detail", {
    url: "/friend/:friendId",
    views: {
      "tab-friends": {
        templateUrl: "templates/friend-detail.html",
        controller: "FriendDetailCtrl"
      }
    }
  }).state("tab.account", {
    url: "/account",
    views: {
      "tab-account": {
        templateUrl: "templates/tab-account.html",
        controller: "AccountCtrl"
      }
    }
  });
  return $urlRouterProvider.otherwise("/tab/dash");
}]);

var controllers;

controllers = angular.module("starter.controllers", []);

controllers.controller("DashCtrl", ["$scope", function($scope) {}]);

controllers.controller("FriendsCtrl", ["$scope", "Friends", function($scope, Friends) {
  var sayHello;
  $scope.friends = Friends.all();
  sayHello = function() {
    return alert("This is the message");
  };
  return $scope.$on("showMessage", sayHello);
}]);

controllers.controller("FriendDetailCtrl", ["$scope", "$stateParams", "Friends", function($scope, $stateParams, Friends) {
  return $scope.friend = Friends.get($stateParams.friendId);
}]);

controllers.controller("AddFriendCtrl", ["$scope", function($scope) {}]);

controllers.controller("AccountCtrl", ["$scope", function($scope) {}]);

var app;

app = angular.module('navigation.controllers', []);

app.controller('NavigationCtrl', ["$scope", "$rootScope", "$ionicSideMenuDelegate", "$state", function($scope, $rootScope, $ionicSideMenuDelegate, $state) {
  var back, states;
  $scope.isVisible = false;
  $scope.items = [];
  back = null;
  $scope.backButtonShown = false;
  states = {
    "tab.friends": {
      title: "Friends",
      items: [
        {
          label: "New Friend",
          state: "tab.addfriend",
          icon: "ion-person-add"
        }, {
          label: "Show Message",
          event: "showMessage",
          icon: "ion-chatbox-working"
        }
      ]
    },
    "tab.friend-detail": {
      back: "tab.friends"
    },
    "tab.addfriend": {
      back: "tab.friends"
    }
  };
  $scope.handle = function(item) {
    $ionicSideMenuDelegate.toggleLeft(false);
    if (item.state) {
      return $state.go(item.state);
    } else {
      return $rootScope.$broadcast(item.event);
    }
  };
  $scope.$on('$stateChangeStart', function(event, toState) {
    var newState;
    newState = toState.name;
    $scope.items = [];
    if ((states[newState] != null) && (states[newState].items != null)) {
      $scope.items = states[newState].items;
      $scope.title = states[newState].title;
    }
    if ((states[newState] != null) && (states[newState].back != null)) {
      $rootScope.$broadcast('fhj.historyChange', {
        showBack: true
      });
      back = states[newState].back;
    } else {
      $rootScope.$broadcast('fhj.historyChange', {
        showBack: false
      });
      back = null;
    }
    return $scope.isVisible = $scope.items.length > 0;
  });
  $scope.back = function() {
    if (back != null) {
      return $state.go(back);
    }
  };
  $scope.showMenu = function() {
    return $ionicSideMenuDelegate.toggleLeft();
  };
  return $scope.showRightMenu = function() {
    return $ionicSideMenuDelegate.toggleRight();
  };
}]);

var directives;

directives = angular.module('navigation.directives', []);

directives.directive('fhjNavBackButton', ["$animate", "$rootScope", "$sanitize", "$ionicConfig", "$ionicNgClick", function($animate, $rootScope, $sanitize, $ionicConfig, $ionicNgClick) {
  var backIsShown;
  backIsShown = false;
  $rootScope.$on('fhj.historyChange', function(e, data) {
    return backIsShown = !!data.showBack;
  });
  return {
    restrict: 'E',
    controller: 'NavigationCtrl',
    compile: function(tElement, tAttrs) {
      var hasIconChild;
      tElement.addClass('button back-button ng-hide');
      hasIconChild = !!(tElement.html() || '').match(/class=.*?ion-/);
      return function($scope, $element, $attr, navBarCtrl) {
        if (!hasIconChild && $element[0].className.indexOf('ion-') === -1) {
          $element.addClass($ionicConfig.backButton.icon());
        }
        if (!angular.isDefined($attr.ngClick)) {
          $ionicNgClick($scope, $element, $scope.back);
        }
        return $scope.$watch(function() {
          if (angular.isDefined($attr.fromTitle)) {
            $element[0].innerHTML = '<span class="back-button-title">' + $sanitize($scope.oldTitle) + '</span>';
          }
          return backIsShown;
        }, ionic.animationFrameThrottle(function(show) {
          if (show) {
            return $animate.removeClass($element, 'ng-hide');
          } else {
            return $animate.addClass($element, 'ng-hide');
          }
        }));
      };
    }
  };
}]);

angular.module("starter.services", []).factory("Friends", function() {
  var friends;
  friends = [
    {
      id: 0,
      name: "Scruff McGruff"
    }, {
      id: 1,
      name: "G.I. Joe"
    }, {
      id: 2,
      name: "Miss Frizzle"
    }, {
      id: 3,
      name: "Ash Ketchum"
    }
  ];
  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      return friends[friendId];
    }
  };
});
