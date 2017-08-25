import { EventContainer } from '../globals';

describe('EventContainer', () => {
	it('#addEventListener: add listener to array if type in the map', () => {
		const ec = new EventContainer();
		ec.addEventListener('type', () => {});

		const listener = () => {};
		ec.addEventListener('type', listener);

		const listeners = ec.getListeners('type') as Function[];
		expect(listeners.length).toEqual(2);
		expect(listeners[1]).toEqual(listener);
	});

	it('#addEventListener: creates new array of listeners if type not in the map', () => {
		const ec = new EventContainer();

		const listener = () => {};
		ec.addEventListener('type', listener);

		const listeners = ec.getListeners('type') as Function[];
		expect(listeners.length).toEqual(1);
		expect(listeners[0]).toEqual(listener);
	});

	it('#removeEventListener', () => {
		const ec = new EventContainer();
		const listener = () => {};
		ec.addEventListener('type', listener);

		ec.removeEventListener('type', listener);

		const listeners = ec.getListeners('type') as Function[];
		expect(listeners.length).toEqual(0);
	});

	it('#clear: removes event listeners of type if type given', () => {
		const ec = new EventContainer();
		ec.addEventListener('type', () => {});

		ec.clear('type');

		const listeners = ec.getListeners('type');
		expect(listeners).toBeUndefined();
	});

	it('#clear: removes all event listeners if type not given', () => {
		const ec = new EventContainer();
		ec.addEventListener('type1', () => {});
		ec.addEventListener('type2', () => {});

		ec.clear();

		expect(ec.getListeners('type1')).toBeUndefined();
		expect(ec.getListeners('type2')).toBeUndefined();
	});

	it('#emit', () => {
		const ec = new EventContainer();
		const listeners = {
			a: () => {},
			b: () => {},
		};
		const spyA = jest.spyOn(listeners, 'a');
		const spyB = jest.spyOn(listeners, 'b');
		ec.addEventListener('type', listeners.a);
		ec.addEventListener('type', listeners.b);

		ec.emit('type');

		expect(spyA).toHaveBeenCalledTimes(1);
		expect(spyB).toHaveBeenCalledTimes(1);
	});
});