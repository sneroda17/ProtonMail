angular.module('proton.message')
.factory('transformEscape', () => {

    /**
     * Unescape the textContent only and inside a synthax Highlighting block
     * Compat
     *     - fontawesome
     *     - prism
     *     - etc.
     * @param  {Node} dom
     * @return {Node}
     */
    const syntaxHighlighterFilter = (dom) => {
        const $pre = dom.querySelectorAll('.pre, pre');
        _.each($pre, (node) => {
            const $codeRaw = node.querySelector('code');

            // Tag <code> exist we can unescape everything
            if ($codeRaw) {
                $codeRaw.innerHTML = $codeRaw.innerHTML.replace(/proton-/g, '');
                return;
            }

            const $code = node.querySelector('.code');
            if (!$code) {
                return;
            }

            _.each($code.querySelectorAll('span'), (node) => {
                if (node.querySelector('*')) {
                    return;
                }

                if (/proton-/.test(node.textContent)) {
                    node.textContent = node.textContent.replace(/proton-/, '');
                }
            });
        });

        return dom;
    };

    /**
     * Prevent attack via the referrer
     *  > area with a target blank and a redirect on window.opener
     * {@link https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/}
     * {@link https://mathiasbynens.github.io/rel-noopener/}
     * @param  {Node} dom
     * @return {Node}
     */
    const noRefferer = (dom) => {
        const $href = dom.querySelectorAll('[href]');
        _.each($href, (node) => {
            node.setAttribute('rel', 'noreferrer nofollow noopener');
        });
        return dom;
    };

    const REGEXP_IS_BREAK = new RegExp('(<svg|/svg|xlink:href|srcset|src=|background=|poster=)', 'g');
    const REGEXP_IS_URL = new RegExp(/url\(/ig);
    const replace = (regex, input) => input.replace(regex, (match) => {
        if (match !== '<svg' && match !== '/svg') {
            return `proton-${match}`;
        }

        // Escape svg tag
        const prefix = match.slice(0, 1);
        return `${prefix}proton-${match.slice(1)}`;
    });

    return (html, message, { content = '' }) => {
        html.innerHTML = replace(REGEXP_IS_URL, replace(REGEXP_IS_BREAK, content));
        return noRefferer(syntaxHighlighterFilter(html));
    };
});
