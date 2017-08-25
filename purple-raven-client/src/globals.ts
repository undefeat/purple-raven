export class EventContainer {

	private listenersMap: Map<string, Function[]> = new Map();

	addEventListener(type: string, listener: Function) {
		if (this.listenersMap.has(type)) {
			const listeners = this.listenersMap.get(type) as Function[];
			listeners.push(listener);
		} else {
			this.listenersMap.set(type, [ listener ]);
		}
	}

	removeEventListener(type: string, listener: Function) {
		if (this.listenersMap.has(type)) {
			const listeners = this.listenersMap.get(type) as Function[];
			const index = listeners.findIndex(l => l === listener);
			if (index !== -1) {
				listeners.splice(index, 1);
			}
		}
	}

	clear(type?: string) {
		if (type && this.listenersMap.has(type)) {
			this.listenersMap.delete(type);
		} else {
			this.listenersMap.clear();
		}
	}

	emit(type: string) {
		if (this.listenersMap.has(type)) {
			(this.listenersMap.get(type) as Function[]).forEach(listener => listener());
		}
	}

	getListeners(type: string) {
		return this.listenersMap.get(type);
	}
}

export const messageEditorEventContainer = new EventContainer();