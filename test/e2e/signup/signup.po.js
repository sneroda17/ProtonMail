module.exports = () => {

    let email = '';

    const SELECTOR = {
        input: {
            username: '#username',
            password: '#password',
            confirmPassword: '#passwordc',
            recoveryEmail: '#notificationEmail'
        },
        select: {
            domains: '.selectDomain'
        },
        steps(n) {
            return `.signUpProcess-step-${n}`;
        }
    };

    SELECTOR.button = {
        toggle: {
            password: `${SELECTOR.input.password} ~ .togglePassword-btn-toggle`,
            confirmPassword: `${SELECTOR.input.confirmPassword} ~ .togglePassword-btn-toggle`
        },
        create: '.signUpProcess-btn-create'
    };

    SELECTOR.messages = {
        username: {
            item: '[class*="signUpProcess-about-"]',
            available: '.signUpProcess-about-success',
            pending: '.signUpProcess-about-pending'
        },

        errors: {
            password: `${SELECTOR.input.password} + [ng-messages] p`,
            confirmPassword: `${SELECTOR.input.confirmPassword} + [ng-messages] p`,
            recoveryEmail: `.signUpProcess-errors-recoveryEmail p`,
            username: '.signUpProcess-about-error p'
        }
    };

    const fillInput = (name, value = '') => {
        return browser.executeScript(`
            const $input = $('${SELECTOR.input[name]}');
            $input.val('${value}').triggerHandler('input');
            return $input.blur();
        `);
    };

    const create = () => {
        return browser.executeScript(`
            $('${SELECTOR.button.create}').click();
        `);
    };

    const usernameMsg = () => {
        const scope = SELECTOR.messages.username;
        return browser.executeScript(`
            return $('${[scope.pending, scope.available].join(', ')}')
                .filter(':visible')
                .text();
        `);
    };

    const getErrors = (key) => {
        const scope = SELECTOR.messages.errors[key];

        const isVisible = () => {
            return browser.executeScript(`
                return $('${scope}')
                    .is(':visible');
            `);
        };

        const count = () => {
            return browser.executeScript(`
                return $('${scope}').length;
            `);
        };

        const getMessage = () => {
            return browser.executeScript(`
                return $('${scope}').map(function() {
                    return angular.copy(this.textContent);
                });
            `);
        };

        return { isVisible, count, getMessage };
    };

    const toggle = (key = 'password') => {
        const scope =  SELECTOR.button.toggle[key];

        const click = () => {
            return browser.executeScript(`
                return $('${scope}').click();
            `);
        };

        const label = () => {
            return browser.executeScript(`
                return $('${scope}').text();
            `);
        };

        return { label, click };
    };

    const saveEmail = (value) => (email = value);
    const getEmail = () => email;


    const steps = (n = 1) => {
        const STEPS = [1, 2, 3, 4];
        const scope = SELECTOR.steps(n);
        const others = STEPS.filter((s) => s !== n).map((s) => SELECTOR.steps(s)).join(', ');

        const isVisible = () => {
            return browser.executeScript(`
                return $('${scope}').is(':visible');
            `);
        };
        const othersHidden = () => {
            return browser.executeScript(`
                return !$('${others}').filter(':visible').length;
            `);
        };

        return { isVisible, othersHidden };
    };

    return {
        fillInput, usernameMsg, getErrors, toggle,
        steps, create,
        getEmail, saveEmail
    };
};
