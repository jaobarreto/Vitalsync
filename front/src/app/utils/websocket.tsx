let socket: WebSocket | null = null
const listeners = new Set<(event: MessageEvent) => void>()

export const initWebSocket = (): WebSocket => {
	if (socket && socket.readyState <= 1) return socket // Conectado ou conectando

	socket = new WebSocket(`ws://127.0.0.1:8001/ws/measurements`)

	socket.onopen = () => {
		console.log('[WS] Conectado ao servidor')
	}

	socket.onmessage = (event) => {
		listeners.forEach((listener) => listener(event))
	}

	socket.onclose = () => {
		console.log('[WS] Conexão encerrada')
	}

	socket.onerror = (e) => {
		console.error('[WS] Erro:', e)
	}

	return socket
}

export const addWebSocketListener = (
	callback: (event: MessageEvent) => void
) => {
	listeners.add(callback)
}

export const removeWebSocketListener = (
	callback: (event: MessageEvent) => void
) => {
	listeners.delete(callback)
}

export const closeWebSocket = () => {
	socket?.close()
	socket = null
	listeners.clear()
}
