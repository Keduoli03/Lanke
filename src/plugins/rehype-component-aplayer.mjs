/// <reference types="mdast" />
import { visit } from 'unist-util-visit';

function createAplayerHtml(properties) {
    const url = (properties.url || '').trim();
    const pic = (properties.pic || '').trim();

    if (!properties.title || !properties.author || !url) {
        return '<div class="aplayer-error" style="color: red; border: 1px solid red; padding: 1rem; border-radius: 0.5rem;">Invalid APlayer configuration. "title", "author", and "url" attributes are required.</div>';
    }

    const playerUuid = `AP${Math.random().toString(36).slice(-6)}`;

    const title = String(properties.title || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
    const author = String(properties.author || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
    
    const showlrc = properties.showlrc === 'true' || properties.showlrc === true;
    const fixed = properties.fixed === 'true' || properties.fixed === true;
    const mini = properties.mini === 'true' || properties.mini === true;

    const scriptContent = `
    (function() {
        function initPlayer_${playerUuid}() {
            const container = document.getElementById('${playerUuid}-player');
            if (container && typeof APlayer !== 'undefined') {
                try {
                    new APlayer({
                        container: container,
                        showlrc: ${showlrc},
                        fixed: ${fixed},
                        mini: ${mini},
                        audio: [{
                            title: '${title}',
                            artist: '${author}',
                            url: '${url}',
                            pic: '${pic}'
                        }]
                    });
                } catch (e) {
                    console.error('[APLAYER] Error initializing player ${playerUuid}:', e);
                    if (container) container.textContent = 'Error initializing APlayer.';
                }
            }
        }

        function setupAplayer() {
            if (window.aplayerLoaded) {
                initPlayer_${playerUuid}();
                return;
            }
            if (!window.aplayerCallbacks) {
                window.aplayerCallbacks = [];
            }
            window.aplayerCallbacks.push(initPlayer_${playerUuid});

            if (window.aplayerLoading) return;
            window.aplayerLoading = true;

            if (!document.querySelector('link[href*="aplayer.min.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css';
                document.head.appendChild(link);
            }

            if (!document.querySelector('script[src*="aplayer.min.js"]')) {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js';
                script.onload = () => {
                    window.aplayerLoaded = true;
                    window.aplayerCallbacks.forEach(cb => cb());
                    window.aplayerCallbacks = [];
                };
                document.head.appendChild(script);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupAplayer);
        } else {
            setupAplayer();
        }
    })();
    `;

    return `
    <div id="${playerUuid}-wrapper" class="aplayer-wrapper" data-title="${properties.title}" data-author="${properties.author}">
        <div id="${playerUuid}-player" class="aplayer-container"></div>
        <script>${scriptContent.replace(/\n\s*/g, '')}</script>
    </div>
    `;
}

/**
 * A remark plugin to transform ::aplayer directives into APlayer components.
 */
export default function remarkAplayer() {
    return (tree) => {
        visit(tree, (node) => {
            if (
                (node.type === 'textDirective' || node.type === 'leafDirective') &&
                node.name === 'aplayer'
            ) {
                const attributes = node.attributes || {};
                const html = createAplayerHtml(attributes);

                // Convert the directive node into an HTML node
                node.type = 'html';
                node.value = html;
            }
        });
    };
}
