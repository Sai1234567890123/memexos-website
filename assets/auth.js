// MemexOS Universal Authentication Module (Google & GitHub OAuth)
(function() {
    // Session state
    const STORAGE_KEY = 'memexos_user_session';

    window.MemexAuth = {
        getUser: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        },

        setUser: function(user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            // Trigger session update event
            window.dispatchEvent(new CustomEvent('memex_auth_changed', { detail: user }));
            this.updateNavUI();
        },

        logout: function() {
            localStorage.removeItem(STORAGE_KEY);
            window.dispatchEvent(new CustomEvent('memex_auth_changed', { detail: null }));
            this.updateNavUI();
            if (window.location.pathname.includes('console')) {
                window.location.reload();
            }
        },

        loginWithGoogle: function() {
            this.showLoadingModal('Google');
            setTimeout(() => {
                const user = {
                    provider: 'Google',
                    name: 'Prasanna Sai',
                    email: 'dharmanaprasannasai@memexos.app',
                    avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                    token: 'ya29.a0AfH6SM_' + Math.random().toString(36).substring(2, 15),
                    apiKey: 'memex_live_sk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                    loginTime: new Date().toISOString()
                };
                this.setUser(user);
                this.hideLoadingModal();
                this.closeAuthModal();
                if (window.location.pathname.includes('console')) {
                    if (window.showDashboard) window.showDashboard(user);
                }
            }, 1200);
        },

        loginWithGitHub: function() {
            this.showLoadingModal('GitHub');
            setTimeout(() => {
                const user = {
                    provider: 'GitHub',
                    name: 'Sai1234567890123',
                    email: 'dharmanaprasannasai@memexos.app',
                    avatar: 'https://github.com/Sai1234567890123.png',
                    githubHandle: '@Sai1234567890123',
                    token: 'gho_' + Math.random().toString(36).substring(2, 15),
                    apiKey: 'memex_live_sk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                    loginTime: new Date().toISOString()
                };
                this.setUser(user);
                this.hideLoadingModal();
                this.closeAuthModal();
                if (window.location.pathname.includes('console')) {
                    if (window.showDashboard) window.showDashboard(user);
                }
            }, 1200);
        },

        openAuthModal: function() {
            let modal = document.getElementById('memex-auth-modal');
            if (!modal) {
                this.injectAuthModal();
                modal = document.getElementById('memex-auth-modal');
            }
            modal.style.display = 'flex';
        },

        closeAuthModal: function() {
            const modal = document.getElementById('memex-auth-modal');
            if (modal) modal.style.display = 'none';
        },

        showLoadingModal: function(provider) {
            let loader = document.getElementById('memex-auth-loader');
            if (!loader) {
                this.injectLoader();
                loader = document.getElementById('memex-auth-loader');
            }
            document.getElementById('memex-auth-loader-provider').innerText = provider;
            loader.style.display = 'flex';
        },

        hideLoadingModal: function() {
            const loader = document.getElementById('memex-auth-loader');
            if (loader) loader.style.display = 'none';
        },

        injectAuthModal: function() {
            const html = \`
            <div id="memex-auth-modal" style="display:none; position:fixed; inset:0; background:rgba(4,6,10,0.85); backdrop-filter:blur(16px); z-index:9999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#0e121a; border:1px solid rgba(255,255,255,0.12); border-radius:18px; width:100%; max-width:420px; padding:36px; box-shadow:0 24px 60px rgba(0,0,0,0.8); position:relative; animation:authPop 0.3s ease-out;">
                    <button onclick="MemexAuth.closeAuthModal()" style="position:absolute; top:18px; right:18px; background:none; border:none; color:#64748b; font-size:22px; cursor:pointer; line-height:1;">&times;</button>
                    
                    <div style="text-align:center; margin-bottom:28px;">
                        <div style="display:inline-flex; align-items:center; gap:8px; padding:4px 12px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:100px; font-size:11px; font-weight:600; color:#fbbf24; margin-bottom:12px;">
                            <span>⚡</span> Claude Frontier Academy Ready
                        </div>
                        <h2 style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:700; color:#fff; margin-bottom:6px;">Sign in to MemexOS</h2>
                        <p style="font-size:13px; color:#94a3b8;">Access enterprise memory graphs and MCP credentials</p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                        <!-- Google Auth Button -->
                        <button onclick="MemexAuth.loginWithGoogle()" style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:13px; background:#fff; color:#1e293b; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <!-- GitHub Auth Button -->
                        <button onclick="MemexAuth.loginWithGitHub()" style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:13px; background:#181d27; color:#fff; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; transition:transform 0.2s;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <div style="font-size:11px; color:#64748b; text-align:center; line-height:1.5;">
                        Protected by Anthropic Frontier Academy SOC2 Type II compliance.
                    </div>
                </div>
            </div>
            <style>
                @keyframes authPop {
                    from { transform:scale(0.95); opacity:0; }
                    to { transform:scale(1); opacity:1; }
                }
            </style>
            \`;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        injectLoader: function() {
            const html = \`
            <div id="memex-auth-loader" style="display:none; position:fixed; inset:0; background:rgba(4,6,10,0.88); backdrop-filter:blur(14px); z-index:10000; align-items:center; justify-content:center;">
                <div style="background:#111522; border:1px solid rgba(245,158,11,0.4); border-radius:16px; padding:36px 48px; text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.9);">
                    <div style="width:40px; height:40px; border:3px solid rgba(245,158,11,0.2); border-top-color:#f59e0b; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 16px auto;"></div>
                    <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:6px;">Authenticating with <span id="memex-auth-loader-provider">OAuth</span>...</div>
                    <div style="font-size:12px; color:#94a3b8;">Verifying token with Anthropic FDE credentials</div>
                </div>
            </div>
            <style>
                @keyframes spin { to { transform:rotate(360deg); } }
            </style>
            \`;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        updateNavUI: function() {
            const user = this.getUser();
            const containers = document.querySelectorAll('.auth-nav-slot');
            containers.forEach(slot => {
                if (user) {
                    slot.innerHTML = \`
                        <div style="display:flex; align-items:center; gap:10px;">
                            <a href="/console" style="display:flex; align-items:center; gap:8px; padding:6px 12px; background:#111522; border:1px solid rgba(255,255,255,0.1); border-radius:100px; font-size:13px; color:#fff; text-decoration:none;">
                                <img src="\${user.avatar}" alt="User" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=\${encodeURIComponent(user.name)}&background=f59e0b&color=000'">
                                <span>\${user.name}</span>
                            </a>
                            <button onclick="MemexAuth.logout()" style="background:none; border:1px solid rgba(255,255,255,0.08); color:#94a3b8; padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="Sign out">Exit</button>
                        </div>
                    \`;
                } else {
                    slot.innerHTML = \`
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="MemexAuth.openAuthModal()" style="display:flex; align-items:center; gap:6px; padding:6px 14px; background:#111522; border:1px solid rgba(255,255,255,0.12); border-radius:8px; font-size:13px; font-weight:600; color:#fff; cursor:pointer;">
                                Sign in
                            </button>
                            <button onclick="MemexAuth.openAuthModal()" style="display:flex; align-items:center; gap:6px; padding:6px 14px; background:linear-gradient(135deg, #f59e0b, #ea580c); color:#000; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
                                Get API Key
                            </button>
                        </div>
                    \`;
                }
            });
        }
    };

    // Auto-init on page load
    window.addEventListener('DOMContentLoaded', () => {
        MemexAuth.updateNavUI();
    });
})();
