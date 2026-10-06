const API_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options,
            signal: options.signal || controller.signal
        });
        let payload = null;
        try {
            payload = await response.json();
        } catch {
            // Algumas respostas de erro podem não possuir corpo JSON.
        }
        if (!response.ok) {
            const mensagem = payload?.message || `Erro na API: ${response.status}`;
            throw new Error(mensagem);
        }
        return payload;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("A requisição demorou demais. Tente novamente.");
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
