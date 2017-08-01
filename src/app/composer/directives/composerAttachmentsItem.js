angular.module('proton.composer')
    .directive('composerAttachmentsItem', ($rootScope, gettextCatalog, attachmentDownloader) => {

        const getTitle = () => gettextCatalog.getString(`Download the attachment ${name}`);
        const dispatcher = (isOutside) => (type, data = {}) => {
            const event = `attachment.upload${isOutside ? '.outside' : ''}`.trim();
            $rootScope.$emit(event, { type, data });
        };

        return {
            replace: true,
            template: `<a class="composerAttachmentsItem-container">
                    <progress-upload data-model="attachment"></progress-upload>
            </a>`,
            link(scope, el, { isOutside = false }) {
                const dispatch = dispatcher(isOutside);
                el[0].title = getTitle(scope.attachment.packet.filename);

                const onClick = (e) => {
                    // Cf Safari
                    if (!attachmentDownloader.isNotSupported(e)) {
                        dispatch('download.composer', scope.attachment);
                    }
                };

                el.on('click', onClick);

                scope.$on('$destroy', () => {
                    el.off('click', onClick);
                });
            }
        };
    });

