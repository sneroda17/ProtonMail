angular.module('proton.ui')
.directive('toggle', (gettextCatalog, $rootScope) => {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/directives/toggle.tpl.html',
        scope: {
            status: '=', // status value
            name: '@', // event name called
            on: '@', // text for on
            off: '@' // text for off
        },
        link(scope, element) {
            if (!scope.on) {
                scope.on = gettextCatalog.getString('Yes', null, 'Title');
            }

            if (!scope.off) {
                scope.off = gettextCatalog.getString('No', null, 'Title');
            }

            function onClick() {
                scope.$applyAsync(() => {
                    scope.status = !scope.status;
                    if (scope.name) {
                        $rootScope.$emit(scope.name, scope.status);
                    }
                });
            }

            element.on('click', onClick);
            scope.$on('$destroy', () => {
                element.off('click', onClick);
            });
        }
    };
});
