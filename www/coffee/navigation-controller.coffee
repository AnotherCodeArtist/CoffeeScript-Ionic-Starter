app = angular.module 'navigation.controllers',[]

app.controller 'NavigationCtrl',
     ($scope,$rootScope,$ionicSideMenuDelegate,$state) ->
        $scope.isVisible = false
        $scope.items = []
        back = null
        $scope.backButtonShown = false
        states =
            "tab.friends":
                title: "Friends"
                items: [
                    {
                        label: "New Friend"
                        state: "tab.addfriend"
                        icon: "ion-person-add"
                    },
                    {
                        label: "Show Message"
                        event: "showMessage"
                        icon: "ion-chatbox-working"
                    }
                ]
            "tab.friend-detail":
                back: "tab.friends"
            "tab.addfriend":
                back: "tab.friends"

        $scope.handle = (item) ->
            $ionicSideMenuDelegate.toggleLeft(false)
            if item.state
                $state.go item.state
            else
                $rootScope.$broadcast item.event

        $scope.$on '$stateChangeStart', (event,toState) ->
            newState = toState.name
            $scope.items = []
            if states[newState]? and states[newState].items?
                $scope.items = states[newState].items
                $scope.title = states[newState].title
            if states[newState]? and states[newState].back?
                $rootScope.$broadcast 'fhj.historyChange', showBack:true
                back = states[newState].back
            else
                $rootScope.$broadcast 'fhj.historyChange', showBack:false
                back = null
            $scope.isVisible = $scope.items.length > 0
        $scope.back = -> $state.go back if back?
        $scope.showMenu = -> $ionicSideMenuDelegate.toggleLeft()
        $scope.showRightMenu = -> $ionicSideMenuDelegate.toggleRight()

