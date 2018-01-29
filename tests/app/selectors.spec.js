const selectors = require('../../src/createApp/selectors');

describe("selector's testing suit", () => {
	describe('test getPathname selector', () => {
		it('getPathname return with the pathname', () => {
			const state = {
				router: {
					pathname: '/foo?bar=0'
				}
			};

			const result = selectors.getPathname(state);
			expect(result).toEqual('/foo?bar=0');
		});

		it('pathname not presented in state, return undefined', () => {
			const state = {
				router: {}
			};

			const result = selectors.getPathname(state);
			expect(result).toEqual(undefined);
		});
	});

	describe('test getResourceName selector', () => {
		it('getResourceName return with the pathname', () => {
			const state = {
				router: {
					params: {
						resourceName: 'bar=0'
					}
				}
			};

			const result = selectors.getResourceName(state);
			expect(result).toEqual('bar=0');
		});

		it('resourceName not presented in state, return undefined', () => {
			const state = {
				router: {
					params: {}
				}
			};

			const result = selectors.getResourceName(state);
			expect(result).toEqual(undefined);
		});
	});

	describe('test getId selector', () => {
		it('getId return with number when the id is number', () => {
			const state = {
				router: {
					params: {
						id: 2
					}
				}
			};

			const result = selectors.getId(state);
			expect(result).toEqual(2);
		});

		it('getId return with number when the id is string', () => {
			const state = {
				router: {
					params: {
						id: '2'
					}
				}
			};

			const result = selectors.getId(state);
			expect(result).toEqual(2);
		});

		it('getId return null when the id is not presented', () => {
			const state = {
				router: {
					params: {}
				}
			};

			const result = selectors.getId(state);
			expect(result).toEqual(null);
		});

		it('getId return new when the id is new', () => {
			const state = {
				router: {
					params: {
						id: 'new'
					}
				}
			};

			const result = selectors.getId(state);
			expect(result).toEqual('new');
		});

		it('getId return new when the id is a random string', () => {
			const state = {
				router: {
					params: {
						id: 'asd'
					}
				}
			};

			const result = selectors.getId(state);
			expect(result).toEqual(NaN);
		});
	});

	describe('test getPage selector', () => {
		it('return with page number correctly', () => {
			const state = {
				router: {
					query: {
						page: 2
					}
				}
			};

			const result = selectors.getPage(state);

			expect(result).toEqual(1);
		});

		it('return 0 when the page number is 0', () => {
			const state = {
				router: {
					query: {
						page: 0
					}
				}
			};

			const result = selectors.getPage(state);
			expect(result).toEqual(0);
		});

		it('return 0 when the page number is a string', () => {
			const state = {
				router: {
					query: {
						page: 'asd'
					}
				}
			};

			const result = selectors.getPage(state);
			expect(result).toEqual(0);
		});
	});

	describe('test getMaxPage selector', () => {
		it('get number of maximal pages', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users'
					}
				},
				settings: {
					limit: 2
				},
				resources: {
					users: {
						count: 20
					}
				}
			};

			const result = selectors.getMaxPage(state);
			expect(result).toEqual(10);
		});

		it('get null when resource name is not the same', () => {
			const state = {
				router: {
					params: {
						resourceName: 'tasks'
					}
				},
				settings: {
					limit: 2
				},
				resources: {
					users: {
						count: 20
					}
				}
			};

			const result = selectors.getMaxPage(state);
			expect(result).toEqual(null);
		});

		it('get null when resource name is not presented', () => {
			const state = {
				router: {
					params: {}
				},
				settings: {
					limit: 2
				},
				resources: {
					users: {
						count: 20
					}
				}
			};

			const result = selectors.getMaxPage(state);
			expect(result).toEqual(null);
		});
	});
	describe('test getLimit selector', () => {
		it('selector return with correct value', () => {
			const state = {
				settings: {
					limit: 2
				}
			};

			const result = selectors.getLimit(state);
			expect(result).toEqual(2);
		});

		it('selector return with undefined when setting is not presneted', () => {
			const state = {
				settings: {}
			};

			const result = selectors.getLimit(state);
			expect(result).toEqual(undefined);
		});
	});

	describe('test getItems selector', () => {
		it('the selector return with correct array', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users'
					}
				},
				resources: {
					users: {
						items: [
							{
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getItems(state);
			expect(result).toEqual([ { a: 1 } ]);
		});

		it('the selector return empty array when resource name is not preseted correctly', () => {
			const state = {
				router: {
					params: {
						resourceName: 'profile'
					}
				},
				resources: {
					users: {
						items: [
							{
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getItems(state);
			expect(result).toEqual([]);
		});
	});

	describe('test getRecord selector', () => {
		it('return the correct record', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users',
						id: 1
					}
				},
				resources: {
					users: {
						items: [
							{
								id: 1,
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getRecord(state);
			expect(result).toEqual({ id: 1, a: 1 });
		});

		it('return null beacuse the ids and params dont mach', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users',
						id: 1
					}
				},
				resources: {
					users: {
						items: [
							{
								id: 2,
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getRecord(state);
			expect(result).toEqual(null);
		});

		it('return null beacuse the id is not a number', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users',
						id: 'asd'
					}
				},
				resources: {
					users: {
						items: [
							{
								id: 2,
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getRecord(state);
			expect(result).toEqual(null);
		});
	});

	describe('test getSchema selector', () => {
		it('return with the selected schema correctly', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users',
						id: 'asd'
					}
				},
				schemas: {
					users: {
						id: 2
					}
				},
				resources: {
					users: {
						items: [
							{
								id: 2,
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getSchema(state);
			expect(result).toEqual({ id: 2 });
		});

		it('return with empty array', () => {
			const state = {
				router: {
					params: {
						resourceName: 'users',
						id: 'asd'
					}
				},
				schemas: [],
				resources: {
					users: {
						items: [
							{
								id: 2,
								a: 1
							}
						]
					}
				}
			};

			const result = selectors.getSchema(state);
			expect(result).toEqual(null);
		});
	});

	describe('test getSchemaList selector', () => {
		it('return with list of schemas', () => {
			const state = {
				schemas: {
					users: {
						id: 1
					},
					tasks: {
						id: 2
					}
				}
			};

			const result = selectors.getSchemaList(state);
			expect(result).toEqual([ 'users', 'tasks' ]);
		});

		it('return with empty array when schemas is not presented in state', () => {
			const state = {};

			const result = selectors.getSchemaList(state);
			expect(result).toEqual([]);
		});
	});
});
