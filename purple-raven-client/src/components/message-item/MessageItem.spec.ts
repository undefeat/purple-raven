import MessageItem from './MessageItem';

describe('MessageItem#isPlural', () => {
	it('returns true when number is plural', () => {
		const component = new MessageItem();

		expect(component.isPlural(0)).toEqual(true);
		expect(component.isPlural(2)).toEqual(true);
		expect(component.isPlural(11)).toEqual(true);
		expect(component.isPlural(20)).toEqual(true);
		expect(component.isPlural(111)).toEqual(true);
	});

	it('returns false when number is singular', () => {
		const component = new MessageItem();

		expect(component.isPlural(1)).toEqual(false);
		expect(component.isPlural(21)).toEqual(false);
		expect(component.isPlural(91)).toEqual(false);
		expect(component.isPlural(121)).toEqual(false);
	});
});

describe('MessageItem#getTimePassed', () => {
	it('throws when dateFrom is after dateTo', () => {
		expect(() => {
			const component = new MessageItem();

			const dateFrom = new Date('2016-03-25T12:00:00Z');
			const dateTo = new Date('2015-03-25T12:00:59Z');

			component.getTimePassed(dateFrom, dateTo)
		}).toThrow();
	});

	it('returns "just now" when less than a minute passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-25T12:00:59Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('just now');
	});

	it('returns "1 min" when less than 2 minutes passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-25T12:01:59Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('1 min');
	});

	it('returns "59 mins" when less than 60 minutes passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-25T12:59:59Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('59 mins');
	});

	it('returns "1 hour" when less than 2 hours passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-25T13:13:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('1 hour');
	});

	it('returns "23 hours" when less than 24 hours passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-26T11:59:59Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('23 hours');
	});

	it('returns "1 day" when less than 2 days passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-03-26T12:01:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('1 day');
	});

	it('returns "29 days" when less than 1 month passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-26T12:00:00Z');
		const dateTo = new Date('2015-04-25T11:59:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('29 days');
	});

	it('returns "1 month" when less than 2 months passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2015-04-26T12:00:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('1 month');
	});

	it('returns "11 months" when less than 1 year passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2016-03-23T12:00:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('11 months');
	});

	it('returns "1 year" when less than 2 years passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2016-03-26T12:00:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('1 year');
	});

	it('returns "2 years" when less than 3 years passed', () => {
		const component = new MessageItem();

		const dateFrom = new Date('2015-03-25T12:00:00Z');
		const dateTo = new Date('2017-03-26T12:00:00Z');

		expect(component.getTimePassed(dateFrom, dateTo)).toEqual('2 years');
	});
});