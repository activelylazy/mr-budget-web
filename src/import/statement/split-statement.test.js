import { assert, should } from 'chai';
import sinon from 'sinon';
import splitStatement from './split-statement';

should();

describe('split statement', () => {
  it('splits statement into two months', () => {
    const statement = {
      transactions: [
        {
          id: 1,
          date: new Date(2017, 7, 1),
          name: 'transaction 1',
          amount: 11.11,
        },
        {
          id: 2,
          date: new Date(2017, 7, 14),
          name: 'transaction 2',
          amount: 22.22,
        },
        {
          id: 3,
          date: new Date(2017, 8, 1),
          name: 'transaction 3',
          amount: 33.33,
        },
      ],
    };

    const splits = splitStatement(statement);

    assert(splits.length.should.equal(2));

    assert(splits[0].year.should.equal(2017));
    assert(splits[0].month.should.equal(7));
    assert(splits[0].transactions.length.should.equal(2));
    assert(splits[0].transactions[0].id.should.equal(1));
    assert(splits[0].transactions[1].id.should.equal(2));

    assert(splits[1].year.should.equal(2017));
    assert(splits[1].month.should.equal(8));
    assert(splits[1].transactions.length.should.equal(1));
    assert(splits[1].transactions[0].id.should.equal(3));
  });
});
