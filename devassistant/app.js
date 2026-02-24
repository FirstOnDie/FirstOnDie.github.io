/**
 * Codi — Tu asistente de código con IA
 * Multi-provider: Groq (free, no EU restriction) + Gemini
 */
(function () {
    "use strict";

    // ========== PROVIDERS CONFIG ==========
    const PROVIDERS = {
        groq: {
            name: "Groq",
            label: "Groq (gratis, sin restricción regional)",
            apiUrl: "https://api.groq.com/openai/v1/chat/completions",
            keyUrl: "https://console.groq.com/keys",
            keyPrefix: "gsk_",
            models: [
                { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (recomendado)" },
                { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B (ultra rápido)" },
                { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
                { id: "gemma2-9b-it", name: "Gemma 2 9B" },
            ],
            defaultModel: "llama-3.3-70b-versatile",
        },
        gemini: {
            name: "Gemini",
            label: "Google Gemini (requiere billing en UE)",
            apiUrl: "https://generativelanguage.googleapis.com/v1beta/models",
            keyUrl: "https://aistudio.google.com/apikey",
            keyPrefix: "AIza",
            models: [
                { id: "gemini-2.0-flash-lite", name: "Gemini 2.0 Flash Lite" },
                { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
                { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
                { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
            ],
            defaultModel: "gemini-2.0-flash-lite",
        },
    };

    const SYSTEM_PROMPTS = {
        explain: `Eres un profesor de programación experto y paciente. El usuario te enviará código.
Tu trabajo es explicar qué hace el código de forma clara y estructurada.
Usa markdown con headers (##), listas y code blocks con el lenguaje apropiado.
Sé conciso pero completo. Explica la lógica paso a paso.
Si detectas posibles problemas, menciónalos brevemente.
Responde en español a menos que el usuario escriba en otro idioma.`,

        tests: `Eres un ingeniero de QA experto. El usuario te enviará código.
Genera unit tests completos y bien estructurados para ese código.
Usa el framework de testing más apropiado para el lenguaje:
- JavaScript: Jest o Vitest
- Python: pytest
- Java: JUnit 5
Incluye tests para: casos normales, edge cases y errores.
Usa markdown con code blocks. Explica brevemente cada test.
Responde en español a menos que el usuario escriba en otro idioma.`,

        review: `Eres un senior developer experimentado haciendo code review.
Analiza el código buscando:
1. 🐛 Bugs potenciales
2. 🔧 Code smells y mejoras
3. ⚡ Rendimiento
4. 🛡 Seguridad
5. 📖 Legibilidad y mejores prácticas
Sé constructivo y específico. Sugiere código corregido cuando sea posible.
Usa markdown con headers, listas y code blocks.
Prioriza los problemas de mayor a menor impacto.
Responde en español a menos que el usuario escriba en otro idioma.`,

        chat: `Eres Codi, un asistente de programación experto, amigable y simpático.
Puedes responder preguntas sobre cualquier tema de programación, arquitectura de software,
buenas prácticas, tecnologías, frameworks, etc.
Usa markdown cuando sea útil (headers, listas, code blocks con lenguaje).
Sé conciso pero informativo. Si no sabes algo, dilo honestamente.
Responde en español a menos que el usuario escriba en otro idioma.`
    };

    const MODE_LABELS = {
        explain: "Modo: Explica código",
        tests: "Modo: Genera tests",
        review: "Modo: Code Review",
        chat: "Modo: Chat libre"
    };

    const CM_MODES = {
        javascript: "javascript",
        python: "python",
        java: "text/x-java",
        html: "htmlmixed",
        css: "css",
        sql: "sql"
    };

    // ========== STATE ==========
    let currentProvider = localStorage.getItem("devassistant_provider") || "groq";
    let apiKey = localStorage.getItem("devassistant_api_key_" + currentProvider) || "";
    let currentModel = localStorage.getItem("devassistant_model") || PROVIDERS[currentProvider].defaultModel;
    let currentMode = "explain";
    let conversationHistory = [];
    let isGenerating = false;
    let editor = null;

    // ========== DOM REFS ==========
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {
        modal: $("#apiKeyModal"),
        apiKeyInput: $("#apiKeyInput"),
        saveApiKey: $("#saveApiKey"),
        toggleKeyVisibility: $("#toggleKeyVisibility"),
        providerSelect: $("#providerSelect"),
        modalProviderInfo: $("#modalProviderInfo"),
        modeSelector: $("#modeSelector"),
        chatModeLabel: $("#chatModeLabel"),
        chatMessages: $("#chatMessages"),
        chatInput: $("#chatInput"),
        sendMessage: $("#sendMessage"),
        sendCode: $("#sendCode"),
        langSelect: $("#langSelect"),
        modelSelect: $("#modelSelect"),
        clearChat: $("#clearChat"),
        settingsBtn: $("#settingsBtn"),
        editorPanel: $("#editorPanel"),
        resizeHandle: $("#resizeHandle"),
    };

    // ========== INIT ==========
    function init() {
        initCodeMirror();
        initModal();
        initModelSelector();
        initModes();
        initChat();
        initResize();
        initWelcomeCards();

        marked.setOptions({
            highlight: function (code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true,
        });
    }

    // ========== CODE MIRROR ==========
    function initCodeMirror() {
        editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
            mode: CM_MODES.javascript,
            theme: "material-darker",
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            indentWithTabs: false,
            lineWrapping: true,
            placeholder: "// Pega tu código aquí...\n// Selecciona un modo arriba y haz clic en 'Enviar'",
        });

        dom.langSelect.addEventListener("change", (e) => {
            const mode = CM_MODES[e.target.value] || "javascript";
            editor.setOption("mode", mode);
        });
    }

    // ========== API KEY MODAL ==========
    function initModal() {
        if (apiKey) {
            dom.modal.classList.add("hidden");
        }

        // Provider selector in modal
        if (dom.providerSelect) {
            dom.providerSelect.innerHTML = Object.entries(PROVIDERS).map(([id, p]) =>
                `<option value="${id}"${id === currentProvider ? ' selected' : ''}>${p.label}</option>`
            ).join('');
            dom.providerSelect.addEventListener("change", (e) => {
                currentProvider = e.target.value;
                localStorage.setItem("devassistant_provider", currentProvider);
                // Load saved key for this provider
                apiKey = localStorage.getItem("devassistant_api_key_" + currentProvider) || "";
                dom.apiKeyInput.value = apiKey;
                updateModalProviderInfo();
                updateModelSelector();
            });
        }
        updateModalProviderInfo();

        dom.saveApiKey.addEventListener("click", () => {
            const key = dom.apiKeyInput.value.trim();
            if (!key) {
                dom.apiKeyInput.style.borderColor = "var(--red)";
                return;
            }
            apiKey = key;
            localStorage.setItem("devassistant_api_key_" + currentProvider, key);
            dom.modal.classList.add("hidden");
        });

        dom.apiKeyInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") dom.saveApiKey.click();
            dom.apiKeyInput.style.borderColor = "";
        });

        dom.toggleKeyVisibility.addEventListener("click", () => {
            const inp = dom.apiKeyInput;
            inp.type = inp.type === "password" ? "text" : "password";
            dom.toggleKeyVisibility.querySelector("i").className =
                inp.type === "password" ? "fas fa-eye" : "fas fa-eye-slash";
        });

        dom.settingsBtn.addEventListener("click", () => {
            apiKey = localStorage.getItem("devassistant_api_key_" + currentProvider) || "";
            dom.apiKeyInput.value = apiKey;
            if (dom.providerSelect) dom.providerSelect.value = currentProvider;
            updateModalProviderInfo();
            dom.modal.classList.remove("hidden");
        });
    }

    function updateModalProviderInfo() {
        if (!dom.modalProviderInfo) return;
        const p = PROVIDERS[currentProvider];
        if (currentProvider === "groq") {
            dom.modalProviderInfo.innerHTML = `
                <div class="step"><span class="step-num">1</span> Ve a <a href="${p.keyUrl}" target="_blank">Groq Console</a> (crea cuenta gratis)</div>
                <div class="step"><span class="step-num">2</span> Haz clic en "Create API Key"</div>
                <div class="step"><span class="step-num">3</span> Copia la clave y pégala aquí abajo</div>
                <div class="step step-tip"><i class="fas fa-check-circle"></i> Sin restricción regional · 30 req/min gratis</div>`;
        } else {
            dom.modalProviderInfo.innerHTML = `
                <div class="step"><span class="step-num">1</span> Ve a <a href="${p.keyUrl}" target="_blank">Google AI Studio</a></div>
                <div class="step"><span class="step-num">2</span> Haz clic en "Create API Key"</div>
                <div class="step"><span class="step-num">3</span> Copia la clave y pégala aquí abajo</div>
                <div class="step step-warn"><i class="fas fa-exclamation-triangle"></i> Requiere billing en UE/EEE (puede no funcionar sin él)</div>`;
        }
        dom.apiKeyInput.placeholder = p.keyPrefix + "...";
    }

    // ========== MODEL SELECTOR ==========
    function initModelSelector() {
        updateModelSelector();
    }

    function updateModelSelector() {
        if (!dom.modelSelect) return;
        const p = PROVIDERS[currentProvider];
        currentModel = localStorage.getItem("devassistant_model_" + currentProvider) || p.defaultModel;
        dom.modelSelect.innerHTML = p.models.map(m =>
            `<option value="${m.id}"${m.id === currentModel ? ' selected' : ''}>${m.name}</option>`
        ).join('');
        dom.modelSelect.onchange = (e) => {
            currentModel = e.target.value;
            localStorage.setItem("devassistant_model_" + currentProvider, currentModel);
        };
    }

    // ========== MODES ==========
    function initModes() {
        $$(".mode-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                $$(".mode-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                currentMode = btn.dataset.mode;
                dom.chatModeLabel.textContent = MODE_LABELS[currentMode];
            });
        });
    }

    // ========== WELCOME CARDS ==========
    function initWelcomeCards() {
        $$(".welcome-card").forEach((card) => {
            card.addEventListener("click", () => {
                const mode = card.dataset.mode;
                $$(".mode-btn").forEach((b) => b.classList.remove("active"));
                $(`.mode-btn[data-mode="${mode}"]`).classList.add("active");
                currentMode = mode;
                dom.chatModeLabel.textContent = MODE_LABELS[mode];
                if (mode !== "chat") {
                    editor.focus();
                } else {
                    dom.chatInput.focus();
                }
            });
        });
    }

    // ========== CHAT ==========
    function initChat() {
        dom.sendMessage.addEventListener("click", handleSendMessage);
        dom.chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        dom.chatInput.addEventListener("input", () => {
            dom.chatInput.style.height = "auto";
            dom.chatInput.style.height = Math.min(dom.chatInput.scrollHeight, 120) + "px";
        });

        dom.sendCode.addEventListener("click", handleSendCode);

        dom.clearChat.addEventListener("click", () => {
            conversationHistory = [];
            dom.chatMessages.innerHTML = "";
            addWelcomeMessage();
        });
    }

    function handleSendMessage() {
        const text = dom.chatInput.value.trim();
        if (!text || isGenerating) return;
        dom.chatInput.value = "";
        dom.chatInput.style.height = "auto";

        if (currentMode === "chat") {
            sendToAI(text);
        } else {
            const code = editor.getValue().trim();
            const fullMessage = code
                ? `${text}\n\nCódigo:\n\`\`\`${dom.langSelect.value}\n${code}\n\`\`\``
                : text;
            sendToAI(fullMessage, text);
        }
    }

    function handleSendCode() {
        const code = editor.getValue().trim();
        if (!code || isGenerating) return;

        const lang = dom.langSelect.value;
        const modeAction = {
            explain: "Explica este código:",
            tests: "Genera unit tests para este código:",
            review: "Haz code review de este código:",
            chat: "Analiza este código:",
        };

        const prompt = `${modeAction[currentMode]}\n\n\`\`\`${lang}\n${code}\n\`\`\``;
        const displayText = `${modeAction[currentMode]} [código en ${lang}]`;
        sendToAI(prompt, displayText);
    }

    // ========== AI API (Multi-Provider) ==========
    async function sendToAI(prompt, displayText) {
        if (!apiKey) {
            dom.modal.classList.remove("hidden");
            return;
        }

        isGenerating = true;
        dom.sendMessage.disabled = true;

        const userDisplay = displayText || prompt;
        addMessage("user", userDisplay);
        conversationHistory.push({ role: "user", content: prompt });

        const typingEl = addTypingIndicator();

        try {
            let reply;
            if (currentProvider === "groq") {
                reply = await callGroq(prompt);
            } else {
                reply = await callGemini(prompt);
            }

            typingEl.remove();
            addMessage("ai", reply);
            conversationHistory.push({ role: "assistant", content: reply });

            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-20);
            }
        } catch (err) {
            typingEl.remove();
            addMessage("ai", `❌ **Error:** ${err.message}`, true);
        } finally {
            isGenerating = false;
            dom.sendMessage.disabled = false;
        }
    }

    // ---- GROQ API (OpenAI-compatible) ----
    async function callGroq(prompt) {
        const messages = [
            { role: "system", content: SYSTEM_PROMPTS[currentMode] },
            ...conversationHistory.map(m => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.content,
            })),
        ];

        const res = await fetch(PROVIDERS.groq.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: currentModel,
                messages: messages,
                temperature: 0.7,
                max_tokens: 4096,
                top_p: 0.95,
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error?.message || `Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content || "No se pudo generar una respuesta.";
    }

    // ---- GEMINI API ----
    async function callGemini(prompt) {
        const contents = conversationHistory.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const body = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: SYSTEM_PROMPTS[currentMode] }],
            },
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 4096,
                topP: 0.95,
            },
        };

        const apiUrl = `${PROVIDERS.gemini.apiUrl}/${currentModel}:generateContent`;
        const res = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const errMsg = err?.error?.message || `Error ${res.status}: ${res.statusText}`;
            if (res.status === 429 || errMsg.toLowerCase().includes('quota')) {
                throw new Error(
                    `Cuota excedida para **${currentModel}**. Prueba a cambiar a **Groq** en la configuración (⚙️) — funciona sin restricción regional.`
                );
            }
            throw new Error(errMsg);
        }

        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar una respuesta.";
    }

    // ========== UI HELPERS ==========
    function addMessage(role, text, isError) {
        const welcome = $(".welcome-msg");
        if (welcome && role === "user") welcome.remove();

        const div = document.createElement("div");
        div.className = `message ${role === "user" ? "user" : "ai"}-message`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.innerHTML = `<span>${role === "user" ? "👤" : "🤖"}</span>`;

        const content = document.createElement("div");
        content.className = "message-content";

        const textDiv = document.createElement("div");
        textDiv.className = `message-text${isError ? " error-text" : ""}`;

        if (role === "ai") {
            textDiv.innerHTML = marked.parse(text);
            textDiv.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightElement(block);
            });
        } else {
            textDiv.textContent = text;
        }

        content.appendChild(textDiv);
        div.appendChild(avatar);
        div.appendChild(content);
        dom.chatMessages.appendChild(div);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const div = document.createElement("div");
        div.className = "message ai-message typing-msg";
        div.innerHTML = `
      <div class="message-avatar"><span>🤖</span></div>
      <div class="message-content">
        <div class="message-text">
          <div class="typing-indicator"><span></span><span></span><span></span></div>
        </div>
      </div>`;
        dom.chatMessages.appendChild(div);
        scrollToBottom();
        return div;
    }

    function addWelcomeMessage() {
        const html = `
    <div class="message ai-message welcome-msg">
      <div class="message-avatar"><span>🤖</span></div>
      <div class="message-content">
        <div class="message-text">
          <h3>¡Hola! Soy Codi 👋</h3>
          <p>Selecciona un modo arriba, pega código en el editor y haz clic en <strong>Enviar</strong>. ¡También puedo responder preguntas en el chat!</p>
        </div>
      </div>
    </div>`;
        dom.chatMessages.insertAdjacentHTML("beforeend", html);
    }

    function scrollToBottom() {
        requestAnimationFrame(() => {
            dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
        });
    }

    // ========== RESIZE ==========
    function initResize() {
        let isResizing = false;

        dom.resizeHandle.addEventListener("mousedown", (e) => {
            isResizing = true;
            dom.resizeHandle.classList.add("dragging");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
            e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            const container = $(".workspace");
            const rect = container.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            const clamped = Math.max(20, Math.min(70, percent));
            dom.editorPanel.style.width = clamped + "%";
            editor.refresh();
        });

        document.addEventListener("mouseup", () => {
            if (!isResizing) return;
            isResizing = false;
            dom.resizeHandle.classList.remove("dragging");
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
            editor.refresh();
        });
    }

    // ========== START ==========
    document.addEventListener("DOMContentLoaded", init);
})();
