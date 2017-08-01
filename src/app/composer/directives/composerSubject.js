angular.module('proton.composer')
    .directive('composerSubject', (editorModel) => ({
        replace: true,
        templateUrl: 'templates/directives/composer/composerSubject.tpl.html',
        link(scope, el) {

            const $input = el[0].querySelector('input');

            const onFocus = () => {
                scope.$applyAsync(() => {
                    scope.message.autocompletesFocussed = false;
                    scope.message.ccbcc = false;
                    scope.message.attachmentsToggle = false;
                });
            };

            const onKeydown = _.throttle((e) => {
                const { editor } = editorModel.find(scope.message);
                // TAB
                if (e.which === 9 && editor) {
                    e.preventDefault();
                    editor.focus();
                }
            }, 150);

            const onBlur = () => {
                scope.$applyAsync(() => scope.saveLater(scope.message));
            };

            $input.addEventListener('focus', onFocus, true);
            $input.addEventListener('keydown', onKeydown, false);
            $input.addEventListener('blur', onBlur, false);

            scope.$on('$destroy', () => {
                $input.removeEventListener('focus', onFocus, true);
                $input.removeEventListener('keydown', onKeydown, false);
                $input.removeEventListener('blur', onBlur, false);
            });
        }
    }));
