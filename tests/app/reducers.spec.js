import { REJECT_FETCHING_SCHEMAS, REJECT_INVOKING, REJECT_ERROR } from '../../src/createApp/actionTypes';
import errorReducer from '../../src/createApp/reducers/error';

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

  })

})