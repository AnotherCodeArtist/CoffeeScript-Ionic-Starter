directives = angular.module 'navigation.directives', []

directives.directive 'fhjNavBackButton',
    [
        '$animate'
        '$rootScope'
        '$sanitize'
        '$ionicNavBarConfig'
        '$ionicNgClick'
        ($animate, $rootScope, $sanitize, $ionicNavBarConfig, $ionicNgClick) ->

            backIsShown = false;
            #If the current viewstate does not allow a back button,
            #always hide it.
            $rootScope.$on 'fhj.historyChange', (e, data) ->
                backIsShown = !!data.showBack

            restrict: 'E'
            controller: 'NavigationCtrl'
            compile: (tElement, tAttrs) ->
                tElement.addClass 'button back-button ng-hide'
                hasIconChild = !!(tElement.html() || '').match(/class=.*?ion-/);
                ($scope, $element, $attr, navBarCtrl) ->

                    # Add a default back button icon based on the nav config, unless one is set
                    if !hasIconChild && $element[0].className.indexOf('ion-') is -1
                        $element.addClass $ionicNavBarConfig.backButtonIcon
                    #Default to ngClick going back, but don't override a custom one
                    if !angular.isDefined($attr.ngClick)
                        $ionicNgClick($scope, $element, $scope.back)

                    #Make sure both that a backButton is allowed in the first place,
                    #and that it is shown by the current view.

                    $scope.$watch(
                        ->
                            if angular.isDefined($attr.fromTitle)
                                $element[0].innerHTML = '<span class="back-button-title">' + $sanitize($scope.oldTitle) + '</span>';
                            backIsShown
                        ionic.animationFrameThrottle (show) ->
                            if show
                                $animate.removeClass($element, 'ng-hide')
                            else
                                $animate.addClass($element, 'ng-hide')
                    )

    ]