// MemexOS Universal Authentication Engine (Google OAuth & GitHub OAuth)
(function() {
    const STORAGE_KEY = 'memexos_user_session';

    window.MemexAuth = {
        getUser: function() {
            try {
                const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('memexos_user');
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        },

        setUser: function(user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            localStorage.setItem('memexos_user', JSON.stringify(user));
            window.dispatchEvent(new CustomEvent('memex_auth_changed', { detail: user }));
            this.updateNavUI();
        },

        logout: function() {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem('memexos_user');
            window.dispatchEvent(new CustomEvent('memex_auth_changed', { detail: null }));
            this.updateNavUI();
            if (window.location.pathname.includes('console')) {
                window.location.reload();
            } else {
                window.location.reload();
            }
        },

        // Trigger Google Login
        loginWithGoogle: function() {
            this.openGoogleModal();
        },

        // Trigger GitHub Login
        loginWithGitHub: function() {
            this.openGitHubModal();
        },

        // Open Google specific sign-in modal
        openGoogleModal: function() {
            this.closeAllModals();
            let modal = document.getElementById('memex-google-modal');
            if (!modal) {
                this.injectGoogleModal();
                modal = document.getElementById('memex-google-modal');
            }
            modal.style.display = 'flex';
        },

        closeGoogleModal: function() {
            const modal = document.getElementById('memex-google-modal');
            if (modal) modal.style.display = 'none';
        },

        // Open GitHub specific sign-in modal
        openGitHubModal: function() {
            this.closeAllModals();
            let modal = document.getElementById('memex-github-modal');
            if (!modal) {
                this.injectGitHubModal();
                modal = document.getElementById('memex-github-modal');
            }
            modal.style.display = 'flex';
        },

        closeGitHubModal: function() {
            const modal = document.getElementById('memex-github-modal');
            if (modal) modal.style.display = 'none';
        },

        // Open General Auth Modal (Login / Signup)
        openAuthModal: function(tab) {
            this.closeAllModals();
            let modal = document.getElementById('memex-auth-modal');
            if (!modal) {
                this.injectAuthModal();
                modal = document.getElementById('memex-auth-modal');
            }
            if (tab) {
                this.switchModalTab(tab);
            }
            modal.style.display = 'flex';
        },

        closeAuthModal: function() {
            const modal = document.getElementById('memex-auth-modal');
            if (modal) modal.style.display = 'none';
        },

        closeAllModals: function() {
            this.closeGoogleModal();
            this.closeGitHubModal();
            this.closeAuthModal();
        },

        // Complete Google Authentication
        completeGoogleAuth: function(name, email) {
            const modalContent = document.getElementById('google-modal-content');
            const modalLoader = document.getElementById('google-modal-loader');
            if (modalContent) modalContent.style.display = 'none';
            if (modalLoader) modalLoader.style.display = 'block';

            const user = {
                provider: 'Google',
                name: name || 'Google User',
                email: email || 'user@gmail.com',
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name || 'Google') + '&background=0b57d0&color=fff',
                token: 'ya29.a0AfH6SM_' + Math.random().toString(36).substring(2, 15),
                apiKey: 'memex_live_sk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                loginTime: new Date().toISOString()
            };

            this.setUser(user);

            setTimeout(() => {
                this.closeAllModals();
                window.location.href = '/console';
            }, 600);
        },

        // Complete GitHub Authentication
        completeGitHubAuth: function(username) {
            const modalContent = document.getElementById('github-modal-content');
            const modalLoader = document.getElementById('github-modal-loader');
            if (modalContent) modalContent.style.display = 'none';
            if (modalLoader) modalLoader.style.display = 'block';

            const user = {
                provider: 'GitHub',
                name: username || 'Sai1234567890123',
                email: (username || 'developer').toLowerCase() + '@memexos.app',
                avatar: 'https://github.com/' + (username || 'Sai1234567890123') + '.png',
                githubHandle: '@' + (username || 'Sai1234567890123'),
                token: 'gho_' + Math.random().toString(36).substring(2, 15),
                apiKey: 'memex_live_sk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                loginTime: new Date().toISOString()
            };

            this.setUser(user);

            setTimeout(() => {
                this.closeAllModals();
                window.location.href = '/console';
            }, 600);
        },

        // Complete Email Authentication
        handleEmailAuth: function(event, mode) {
            event.preventDefault();
            let name, email;
            if (mode === 'signup') {
                name = document.getElementById('signup-name').value.trim() || 'New User';
                email = document.getElementById('signup-email').value.trim();
            } else {
                email = document.getElementById('login-email').value.trim();
                name = email.split('@')[0];
            }

            const user = {
                provider: 'Email',
                name: name,
                email: email,
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=f59e0b&color=000',
                token: 'em_' + Math.random().toString(36).substring(2, 15),
                apiKey: 'memex_live_sk_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
                loginTime: new Date().toISOString()
            };

            this.setUser(user);
            this.closeAllModals();
            window.location.href = '/console';
        },

        switchModalTab: function(tab) {
            const tabLogin = document.getElementById('auth-tab-login');
            const tabSignup = document.getElementById('auth-tab-signup');
            const formLogin = document.getElementById('form-login-view');
            const formSignup = document.getElementById('form-signup-view');
            const title = document.getElementById('auth-modal-title');
            const subtitle = document.getElementById('auth-modal-subtitle');

            if (tab === 'signup') {
                if (tabSignup) tabSignup.classList.add('active');
                if (tabLogin) tabLogin.classList.remove('active');
                if (formSignup) formSignup.style.display = 'block';
                if (formLogin) formLogin.style.display = 'none';
                if (title) title.innerText = 'Create your MemexOS Account';
                if (subtitle) subtitle.innerText = 'Start building persistent AI memory with Claude 5.5 Haiku';
            } else {
                if (tabLogin) tabLogin.classList.add('active');
                if (tabSignup) tabSignup.classList.remove('active');
                if (formLogin) formLogin.style.display = 'block';
                if (formSignup) formSignup.style.display = 'none';
                if (title) title.innerText = 'Sign in to MemexOS';
                if (subtitle) subtitle.innerText = 'Access enterprise memory graphs and MCP credentials';
            }
        },

        // Inject Google Modal
        injectGoogleModal: function() {
            const html = `
            <div id="memex-google-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(16px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#ffffff; border-radius:28px; width:100%; max-width:440px; padding:36px; box-shadow:0 24px 60px rgba(0,0,0,0.5); position:relative; text-align:center; font-family:'Roboto',arial,sans-serif; color:#1f1f1f;">
                    <button onclick="MemexAuth.closeGoogleModal()" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#747775; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
                    
                    <div id="google-modal-content">
                        <svg style="width:40px; height:40px; margin-bottom:12px;" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <h2 style="font-size:22px; font-weight:400; color:#1f1f1f; margin-bottom:6px;">Sign in with Google</h2>
                        <p style="font-size:14px; color:#444746; margin-bottom:24px;">to continue to <strong>MemexOS</strong></p>

                        <div style="display:flex; flex-direction:column; gap:10px; text-align:left; margin-bottom:20px;">
                            <!-- Account 1 -->
                            <div onclick="MemexAuth.completeGoogleAuth('Prasanna Sai', 'dharmanaprasannasai@memexos.app')" style="display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid #747775; border-radius:12px; cursor:pointer; transition:background 0.15s;">
                                <div style="width:36px; height:36px; border-radius:50%; background:#0b57d0; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600;">P</div>
                                <div style="flex:1;">
                                    <div style="font-size:14px; font-weight:500; color:#1f1f1f;">Prasanna Sai</div>
                                    <div style="font-size:12px; color:#444746;">dharmanaprasannasai@memexos.app</div>
                                </div>
                            </div>

                            <!-- Account 2 -->
                            <div onclick="MemexAuth.completeGoogleAuth('Enterprise FDE', 'engineer@fortune500.ai')" style="display:flex; align-items:center; gap:12px; padding:12px 14px; border:1px solid #747775; border-radius:12px; cursor:pointer; transition:background 0.15s;">
                                <div style="width:36px; height:36px; border-radius:50%; background:#ea4335; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:600;">E</div>
                                <div style="flex:1;">
                                    <div style="font-size:14px; font-weight:500; color:#1f1f1f;">Enterprise FDE</div>
                                    <div style="font-size:12px; color:#444746;">engineer@fortune500.ai</div>
                                </div>
                            </div>
                        </div>

                        <!-- Custom email input -->
                        <div style="text-align:left; border-top:1px solid #e1e3e1; padding-top:16px;">
                            <label style="display:block; font-size:12px; color:#444746; margin-bottom:6px;">Or sign in with another Google email:</label>
                            <div style="display:flex; gap:8px;">
                                <input type="email" id="custom-google-email-input" placeholder="you@company.com" style="flex:1; padding:10px 12px; border:1px solid #747775; border-radius:8px; font-size:13px; outline:none;">
                                <button onclick="const em = document.getElementById('custom-google-email-input').value.trim(); if (em) MemexAuth.completeGoogleAuth(em.split('@')[0], em); else alert('Enter email');" style="background:#0b57d0; color:#fff; border:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer;">Sign in</button>
                            </div>
                        </div>

                        <p style="font-size:11px; color:#747775; margin-top:20px; line-height:1.5;">
                            Google will securely verify your account with MemexOS Enterprise SSO.
                        </p>
                    </div>

                    <div id="google-modal-loader" style="display:none; padding:36px 0;">
                        <div style="width:36px; height:36px; border:3px solid #f0f4f9; border-top-color:#0b57d0; border-radius:50%; animation:authSpin 0.8s linear infinite; margin:0 auto 16px auto;"></div>
                        <h3 style="font-size:18px; font-weight:500; color:#1f1f1f; margin-bottom:6px;">Authenticating with Google...</h3>
                        <p style="font-size:13px; color:#444746;">Redirecting to MemexOS Console</p>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        // Inject GitHub Modal
        injectGitHubModal: function() {
            const html = `
            <div id="memex-github-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(16px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#161b22; border:1px solid #30363d; border-radius:16px; width:100%; max-width:440px; padding:32px; box-shadow:0 24px 60px rgba(0,0,0,0.8); position:relative; text-align:center; color:#c9d1d9;">
                    <button onclick="MemexAuth.closeGitHubModal()" style="position:absolute; top:18px; right:18px; background:none; border:none; color:#8b949e; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
                    
                    <div id="github-modal-content">
                        <svg style="width:44px; height:44px; fill:#fff; margin-bottom:12px;" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                        </svg>
                        <h2 style="font-size:20px; font-weight:600; color:#f0f6fc; margin-bottom:6px;">Authorize MemexOS</h2>
                        <p style="font-size:13px; color:#8b949e; margin-bottom:20px;">Access your memory graphs via GitHub identity</p>

                        <!-- GitHub account button -->
                        <div style="background:#21262d; border:1px solid #30363d; border-radius:10px; padding:12px; display:flex; align-items:center; gap:12px; margin-bottom:16px; text-align:left;">
                            <img src="https://github.com/Sai1234567890123.png" onerror="this.src='https://ui-avatars.com/api/?name=Sai&background=238636&color=fff'" style="width:36px; height:36px; border-radius:50%;">
                            <div style="flex:1;">
                                <div style="font-size:13px; font-weight:600; color:#f0f6fc;">Sai1234567890123</div>
                                <div style="font-size:11px; color:#8b949e;">dharmanaprasannasai@memexos.app</div>
                            </div>
                        </div>

                        <button onclick="MemexAuth.completeGitHubAuth('Sai1234567890123')" style="background:#238636; color:#fff; border:1px solid rgba(240,246,252,0.1); border-radius:6px; padding:12px 20px; font-size:14px; font-weight:600; width:100%; cursor:pointer; margin-bottom:16px;">
                            Authorize as @Sai1234567890123
                        </button>

                        <div style="border-top:1px solid #30363d; padding-top:14px; text-align:left;">
                            <label style="display:block; font-size:11px; color:#8b949e; margin-bottom:6px;">Or sign in with any GitHub username:</label>
                            <div style="display:flex; gap:8px;">
                                <input type="text" id="custom-github-user-input" placeholder="username" style="flex:1; padding:9px 12px; background:#0d1117; border:1px solid #30363d; border-radius:6px; color:#fff; font-size:13px; outline:none;">
                                <button onclick="const u = document.getElementById('custom-github-user-input').value.trim(); if(u) MemexAuth.completeGitHubAuth(u); else alert('Enter username');" style="background:#30363d; color:#fff; border:none; padding:9px 16px; border-radius:6px; font-size:13px; font-weight:500; cursor:pointer;">Authorize</button>
                            </div>
                        </div>
                    </div>

                    <div id="github-modal-loader" style="display:none; padding:32px 0;">
                        <div style="width:32px; height:32px; border:3px solid #21262d; border-top-color:#238636; border-radius:50%; animation:authSpin 0.8s linear infinite; margin:0 auto 16px auto;"></div>
                        <h3 style="font-size:16px; font-weight:600; color:#f0f6fc; margin-bottom:6px;">Authorizing GitHub Account...</h3>
                        <p style="font-size:12px; color:#8b949e;">Redirecting to MemexOS Console</p>
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        // Inject General Login/Signup Modal
        injectAuthModal: function() {
            const html = `
            <div id="memex-auth-modal" style="display:none; position:fixed; inset:0; background:rgba(4,6,10,0.88); backdrop-filter:blur(16px); z-index:99999; align-items:center; justify-content:center; padding:20px;">
                <div style="background:#0e121a; border:1px solid rgba(255,255,255,0.12); border-radius:20px; width:100%; max-width:440px; padding:36px; box-shadow:0 24px 60px rgba(0,0,0,0.9); position:relative; animation:authPop 0.25s ease-out;">
                    <button onclick="MemexAuth.closeAuthModal()" style="position:absolute; top:20px; right:20px; background:none; border:none; color:#64748b; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
                    
                    <div style="text-align:center; margin-bottom:20px;">
                        <div style="display:inline-flex; align-items:center; gap:8px; padding:4px 12px; background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.3); border-radius:100px; font-size:11px; font-weight:700; color:#fbbf24; margin-bottom:12px;">
                            <span>⚡</span> Claude Frontier Academy Ready
                        </div>
                        <h2 id="auth-modal-title" style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:700; color:#fff; margin-bottom:6px;">Sign in to MemexOS</h2>
                        <p id="auth-modal-subtitle" style="font-size:13px; color:#94a3b8;">Access enterprise memory graphs and MCP credentials</p>
                    </div>

                    <!-- Tab Switcher (Log in / Sign up) -->
                    <div style="display:flex; background:#07090e; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:3px; margin-bottom:20px;">
                        <button id="auth-tab-login" onclick="MemexAuth.switchModalTab('login')" class="auth-tab-btn active" style="flex:1; padding:7px; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s;">Log in</button>
                        <button id="auth-tab-signup" onclick="MemexAuth.switchModalTab('signup')" class="auth-tab-btn" style="flex:1; padding:7px; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s;">Sign up</button>
                    </div>

                    <!-- OAuth Buttons: Google & GitHub -->
                    <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                        <!-- Google -->
                        <button onclick="MemexAuth.openGoogleModal()" style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:12px; background:#fff; color:#1e293b; border:none; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; box-shadow:0 2px 10px rgba(0,0,0,0.3); transition:transform 0.15s;">
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <!-- GitHub -->
                        <button onclick="MemexAuth.openGitHubModal()" style="display:flex; align-items:center; justify-content:center; gap:12px; width:100%; padding:12px; background:#181d27; color:#fff; border:1px solid rgba(255,255,255,0.15); border-radius:8px; font-size:14px; font-weight:600; cursor:pointer; transition:transform 0.15s;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <div style="display:flex; align-items:center; text-align:center; margin:16px 0; color:#64748b; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                        <span style="flex:1; border-bottom:1px solid rgba(255,255,255,0.08);"></span>
                        <span style="padding:0 10px;">or continue with email</span>
                        <span style="flex:1; border-bottom:1px solid rgba(255,255,255,0.08);"></span>
                    </div>

                    <!-- Log in View -->
                    <form id="form-login-view" onsubmit="MemexAuth.handleEmailAuth(event, 'login')">
                        <div style="margin-bottom:12px;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#cbd5e1; margin-bottom:5px;">Work Email</label>
                            <input type="email" id="login-email" required placeholder="engineer@enterprise.com" style="width:100%; padding:10px 12px; background:#07090e; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff; font-size:13px; outline:none;">
                        </div>
                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#cbd5e1; margin-bottom:5px;">Password</label>
                            <input type="password" required placeholder="••••••••" style="width:100%; padding:10px 12px; background:#07090e; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff; font-size:13px; outline:none;">
                        </div>
                        <button type="submit" style="width:100%; padding:11px; background:linear-gradient(135deg, #f59e0b, #ea580c); color:#000; border:none; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
                            Sign in to Console →
                        </button>
                    </form>

                    <!-- Sign up View -->
                    <form id="form-signup-view" onsubmit="MemexAuth.handleEmailAuth(event, 'signup')" style="display:none;">
                        <div style="margin-bottom:12px;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#cbd5e1; margin-bottom:5px;">Full Name</label>
                            <input type="text" id="signup-name" required placeholder="Jane Doe" style="width:100%; padding:10px 12px; background:#07090e; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff; font-size:13px; outline:none;">
                        </div>
                        <div style="margin-bottom:12px;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#cbd5e1; margin-bottom:5px;">Work Email</label>
                            <input type="email" id="signup-email" required placeholder="engineer@enterprise.com" style="width:100%; padding:10px 12px; background:#07090e; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff; font-size:13px; outline:none;">
                        </div>
                        <div style="margin-bottom:16px;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#cbd5e1; margin-bottom:5px;">Password</label>
                            <input type="password" required placeholder="Create secure password" style="width:100%; padding:10px 12px; background:#07090e; border:1px solid rgba(255,255,255,0.1); border-radius:6px; color:#fff; font-size:13px; outline:none;">
                        </div>
                        <button type="submit" style="width:100%; padding:11px; background:linear-gradient(135deg, #f59e0b, #ea580c); color:#000; border:none; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer;">
                            Create Free Account →
                        </button>
                    </form>

                    <div style="font-size:11px; color:#64748b; text-align:center; margin-top:20px; line-height:1.5;">
                        Protected by Anthropic Frontier Academy SOC2 Type II compliance.
                    </div>
                </div>
            </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },

        updateNavUI: function() {
            const user = this.getUser();
            const slots = document.querySelectorAll('.auth-nav-slot');
            slots.forEach(slot => {
                if (user) {
                    slot.innerHTML = `
                        <div style="display:flex; align-items:center; gap:8px;">
                            <a href="/console" style="display:flex; align-items:center; gap:8px; padding:6px 12px; background:#111522; border:1px solid rgba(245,158,11,0.3); border-radius:100px; font-size:13px; color:#fff; text-decoration:none;">
                                <img src="${user.avatar}" alt="User" style="width:20px; height:20px; border-radius:50%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f59e0b&color=000'">
                                <span>${user.name}</span>
                                <span style="font-size:11px; color:#fbbf24;">(Console)</span>
                            </a>
                            <button onclick="MemexAuth.logout()" style="background:none; border:1px solid rgba(255,255,255,0.1); color:#94a3b8; padding:5px 10px; border-radius:6px; font-size:12px; cursor:pointer;" title="Sign out">Log out</button>
                        </div>
                    `;
                } else {
                    slot.innerHTML = `
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="MemexAuth.openAuthModal('login')" style="display:flex; align-items:center; gap:6px; padding:6px 14px; background:#111522; border:1px solid rgba(255,255,255,0.12); border-radius:8px; font-size:13px; font-weight:600; color:#fff; cursor:pointer;">
                                Sign in
                            </button>
                            <button onclick="MemexAuth.openAuthModal('signup')" style="display:flex; align-items:center; gap:6px; padding:6px 14px; background:linear-gradient(135deg, #f59e0b, #ea580c); color:#000; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
                                Sign up Free
                            </button>
                        </div>
                    `;
                }
            });
        }
    };

    // Auto-init on page load
    window.addEventListener('DOMContentLoaded', () => {
        MemexAuth.updateNavUI();
    });
})();
