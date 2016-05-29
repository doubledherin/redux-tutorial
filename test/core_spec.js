import {List, Map} from 'immutable'
import {expect} from 'chai'
import {setEntries, next, vote} from '../src/core'

describe('application logic', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map()
      const entries = List.of('Trainspotting', '28 Days Later')
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({entries: List.of('Trainspotting', '28 Days Later')
      }));
    });
    it('converts to immutable', () => {
      const state = Map()
      const entries = ['Trainspotting', '28 Days Later']
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });
  });
  describe('next', () => {
    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({ pair: List.of('Trainspotting', '28 Days Later')}),
        entries: List.of('Sunshine')
      }))
    })
    it('appends the winner back onto the list of entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }))
    })
    it('in the case of a tie, appends both onto the end of entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }))
    })
    it('marks the winner when just one entry is left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }))
    })
  })
  describe('vote', () => {
    it('starts a tally for the first vote', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List()
      })
      const nextState = vote(state, 'Trainspotting')
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 1
          })
        }),
        entries: List()
      }))
    })
    it('adds to the existing tally when a new vote is received', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        }),
        entries: List()
      })
      const nextState = vote(state, 'Trainspotting')
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      }))
    })
  })
});
