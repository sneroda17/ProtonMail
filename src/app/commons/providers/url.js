angular.module('proton.commons')
    .provider('url', function urlProvider() {
        // Set base url from grunt config
        let base;

        this.setBaseUrl = (newUrl) => {
            base = newUrl;
        };

        this.$get = () => {
            return {
                host() {
                    const link = document.createElement('a');
                    link.href = base;
                    return link.host;
                },
                get() {
                    return base;
                },
                /**
                 * Factory to build urls for a scope
                 *     ex:
                 *         const getUrl = url.build('contact')
                 *         getUrl(1) === xxx/contact/1
                 *         getUrl(1, 2) === xxx/contact/1/2
                 *         getUrl() === xxx/contact
                 *
                 * @param  {String} key Scope
                 * @return {Function}
                 */
                build(key) {
                    return (...path) => this.get() + [`/${key}`].concat(path).join('/');
                }
            };
        };
    });
