angular.module('proton.authentication')
    .factory('authApi', ($http, url) => {
        const requestURL = url.build('auth');
        return {
            /**
             * Authenticate
             * @param {Object} params
             * @return {Promise}
             */
            authenticate(params = {}) {
                return $http.post(requestURL(), params);
            },
            /**
             * Refresh an expired token
             * @param {Object} params
             * @return {Promise}
             */
            refresh(params = {}) {
                return $http.post(requestURL('refresh'), params);
            },
            /**
             * Set secure cookies, web app only
             * @param {Object} params
             * @return {Promise}
             */
            cookies(params = {}) {
                return $http.post(requestURL('cookies'), params);
            },
            /**
             * Set up SRP authentication request
             * @return {Promise}
             */
            info(params = {}) {
                return $http.post(requestURL('info'), params);
            },
            /**
             * @return {Promise}
             */
            modulus() {
                return $http.get(requestURL('modulus'));
            },
            /**
             * Revoke a token
             * @return {Promise}
             */
            revoke() {
                return $http.delete(requestURL());
            },
            /**
             * Revoke all other access tokens, locked
             * @return {Promise}
             */
            revokeOthers() {
                return $http.delete(requestURL('others'));
            }
        };
    });
