angular.module('proton.settings')
.controller('AppearanceController', (
    $log,
    $rootScope,
    $scope,
    $state,
    $window,
    gettextCatalog,
    $q,
    authentication,
    CONSTANTS,
    networkActivityTracker,
    eventManager,
    settingsApi,
    notify) => {
    const unsubscribe = [];
    $scope.appearance = {
        cssTheme: authentication.user.Theme,
        ComposerMode: authentication.user.ComposerMode,
        ViewLayout: authentication.user.ViewLayout,
        MessageButtons: authentication.user.MessageButtons,
        viewMode: !(authentication.user.ViewMode) // BE data is reversed
    };

    unsubscribe.push($rootScope.$on('changeViewMode', changeViewMode));
    $scope.$on('$destroy', () => {
        unsubscribe.forEach((cb) => cb());
        unsubscribe.length = 0;
    });
    $scope.loadThemeClassic = function () {
        $scope.appearance.cssTheme = 'CLASSIC';
        $scope.saveTheme();
    };

    $scope.saveTheme = function () {
        const deferred = $q.defer();

        networkActivityTracker.track(
                settingsApi.theme({ Theme: $scope.appearance.cssTheme })
                .then((result) => {
                    if (result.data && result.data.Code === 1000) {
                        notify({ message: gettextCatalog.getString('Theme saved', null), classes: 'notification-success' });
                        eventManager.call().then(() => {
                            deferred.resolve();
                        });
                    } else if (result.data && result.data.Error) {
                        notify({ message: result.data.Error, classes: 'notification-danger' });
                        deferred.reject();
                    } else {
                        notify({ message: gettextCatalog.getString('Unable to save your changes, please try again.', null, 'Error'), classes: 'notification-danger' });
                        deferred.reject();
                    }
                })
            );

        return deferred.promise;
    };

    $scope.clearTheme = function () {
            // Reset the theme value
        $scope.appearance.cssTheme = '';
            // Save the theme
        $scope.saveTheme();
    };

    $scope.saveComposerMode = function () {
        const value = parseInt($scope.appearance.ComposerMode, 10);

        networkActivityTracker.track(
                settingsApi.setComposerMode({ ComposerMode: value })
                .then((result) => {
                    if (result.data && result.data.Code === 1000) {
                        notify({ message: gettextCatalog.getString('Compose mode saved', null, 'Info'), classes: 'notification-success' });
                        return eventManager.call();
                    } else if (result.data && result.data.Error) {
                        notify({ message: result.data.Error, classes: 'notification-danger' });
                    }
                })
            );
    };

    $scope.saveLayoutMode = function () {
        const value = $scope.appearance.ViewLayout;

        networkActivityTracker.track(
                settingsApi.setViewlayout({ ViewLayout: value })
                .then((result) => {
                    if (result.data && result.data.Code === 1000) {
                        notify({ message: gettextCatalog.getString('Layout saved', null), classes: 'notification-success' });
                        return eventManager.call();
                    } else if (result.data && result.data.Error) {
                        notify({ message: result.data.Error, classes: 'notification-danger' });
                    }
                })
            );
    };

    $scope.saveButtonsPosition = () => {
        const MessageButtons = $scope.appearance.MessageButtons;
        const promise = settingsApi.setMessageStyle({ MessageButtons })
            .then((result) => {
                if (result.data && result.data.Code === 1000) {
                    return eventManager.call()
                    .then(() => {
                        notify({ message: gettextCatalog.getString('Buttons position saved', null, 'Info'), classes: 'notification-success' });
                        return Promise.resolve();
                    });
                } else if (result.data && result.data.Error) {
                    return Promise.reject(result.data.Error);
                }
            });

        networkActivityTracker.track(promise);

        return promise;
    };

    function changeViewMode(event, viewMode) {
        const ViewMode = (viewMode) ? CONSTANTS.CONVERSATION_VIEW_MODE : CONSTANTS.MESSAGE_VIEW_MODE; // Be careful, BE is reversed
        const promise = settingsApi.setViewMode({ ViewMode })
            .then((result) => {
                if (result.data && result.data.Code === 1000) {
                    return eventManager.call()
                    .then(() => {
                        notify({ message: gettextCatalog.getString('View mode saved', null, 'Info'), classes: 'notification-success' });
                        return Promise.resolve();
                    });
                } else if (result.data && result.data.Error) {
                    return Promise.reject(result.data.Error);
                }
            });

        networkActivityTracker.track(promise);

        return promise;
    }
});
