controllers = angular.module("starter.controllers", [])

controllers.controller "DashCtrl", [ '$scope', ($scope) ->
]


controllers.controller "FriendsCtrl", ['$scope', 'Friends', ($scope, Friends) ->
    $scope.friends = Friends.all()
    sayHello = -> alert "This is the message"
    $scope.$on "showMessage", sayHello
]

controllers.controller "FriendDetailCtrl", ['$scope', '$stateParams', 'Friends', ($scope, $stateParams, Friends) ->
    $scope.friend = Friends.get $stateParams.friendId
]

controllers.controller "AddFriendCtrl", ['$scope', ($scope) ->

]

controllers.controller "AccountCtrl", ['$scope', ($scope) ->
]


