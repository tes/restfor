import { 
  REJECT_FETCHING_SCHEMAS, 
  REJECT_INVOKING, 
  REJECT_ERROR,
  START_FETCHING_SCHEMAS,
  START_INVOKING,
  RESOLVE_FETCHING_SCHEMAS,
  RESOLVE_INVOKING
} from '../../src/createApp/actionTypes';

import errorReducer from '../../src/createApp/reducers/error';
import isFetchingReducer from '../../src/createApp/reducers/isFetching';
import resourcesReducer from '../../src/createApp/reducers/resources';

describe('Reducers test', () => {

  describe('Error reducer', () => {

    //REJECT_FETCHING_SCHEMAS action in the reducer
    it('REJECT_FETCHING_SCHEMAS', () => {

      const state = null;
      const action = {
        type: REJECT_FETCHING_SCHEMAS,
        error: {
          message: 'This is an error message'
        }
      };

      expect(errorReducer(state, action)).toEqual({
        message: 'This is an error message'
      });

    });

    //REJECT_INVOKING action in the reducer
    it('REJECT_INVOKING', () => {

      const state = null;
      const action = {
        type: REJECT_INVOKING,
        error: {
          message: 'This is an error message'
        }
      };

      expect(errorReducer(state, action)).toEqual({
        message: 'This is an error message'
      });

    });

    //REJECT_ERROR action in the reducer
    it('REJECT_ERROR', () => {

      const state = null;
      const action = {
        type: REJECT_ERROR
      };

      expect(errorReducer(state, action)).toBeNull();

    });

    //Default action in the reducer
    it('RANDOM_ACTION', () => {

      const state = {
        param1: 1,
        param2: 'this is a string',
        param3: true
      };
      const action = {
        type: 'RANDOM_ACTION'
      };

      expect(errorReducer(state, action)).toEqual({
        param1: 1,
        param2: 'this is a string',
        param3: true
      });

    });

  });

  describe('isFetching reducer', () => {

    it('START_FETCHING_SCHEMAS', () => {

      const state = false;
      const action = {
        type: START_FETCHING_SCHEMAS
      }

      expect(isFetchingReducer(state, action)).toEqual(true);

    });

    it('START_INVOKING', () => {

      const state = false;
      const action = {
        type: START_INVOKING
      }

      expect(isFetchingReducer(state, action)).toEqual(true);

    });

    it('RESOLVE_FETCHING_SCHEMAS', () => {

      const state = false;
      const action = {
        type: RESOLVE_FETCHING_SCHEMAS
      }

      expect(isFetchingReducer(state, action)).toEqual(false);

    });

    it('RESOLVE_INVOKING', () => {

      const state = false;
      const action = {
        type: RESOLVE_INVOKING
      }

      expect(isFetchingReducer(state, action)).toEqual(false);

    });

    it('REJECT_FETCHING_SCHEMAS', () => {

      const state = false;
      const action = {
        type: REJECT_FETCHING_SCHEMAS
      }

      expect(isFetchingReducer(state, action)).toEqual(false);

    });

    it('REJECT_INVOKING', () => {

      const state = false;
      const action = {
        type: REJECT_INVOKING
      }

      expect(isFetchingReducer(state, action)).toEqual(false);

    });

    it('RANDOM_ACTION', () => {

      const state = false;
      const action = {
        type: 'RANDOM_ACTION'
      }

      expect(isFetchingReducer(state, action)).toEqual(false);

    });

    it('RANDOM_ACTION', () => {

      const state = true;
      const action = {
        type: 'RANDOM_ACTION'
      }

      expect(isFetchingReducer(state, action)).toEqual(true);

    });

    

  });

  describe('resources reducer', () => {

    it('RESOLVE_FETCHING_SCHEMAS', () => {

      const schemas = [
        {
          id: 1,
          text: "schema1"
        },
        {
          id: 2,
          text: "schema2"
        }
      ];

      const state = {};
      const action = {
        type: RESOLVE_FETCHING_SCHEMAS,
        schemas
      };
      

      expect(resourcesReducer(state, action)).toEqual({        
        0: {
          items: [],
          count: 0
        },
        1: {
          items: [],
          count: 0
        }
      });

    });

  });

})