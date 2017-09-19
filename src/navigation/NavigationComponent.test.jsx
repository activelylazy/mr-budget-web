import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Navigation from './NavigationComponent';

should();

describe('navigation component', () => {
  it('renders links', () => {
    const navigation = shallow(<Navigation changeArea={sinon.stub()} />);

    assert(navigation.find('NavItem').length.should.equal(4));
    assert(navigation.find('.accounts').children().text().should.equal('Accounts'));
    assert(navigation.find('.accounts').prop('active').should.equal(true));

    assert(navigation.find('.categories').children().text().should.equal('Categories'));
    assert(navigation.find('.categories').prop('active').should.equal(false));

    assert(navigation.find('.review').children().text().should.equal('Review'));
    assert(navigation.find('.review').prop('active').should.equal(false));

    assert(navigation.find('.import').children().text().should.equal('Import'));
    assert(navigation.find('.import').prop('active').should.equal(false));
  });

  it('changes to accounts area', () => {
    const changeArea = sinon.spy();
    const navigation = shallow(<Navigation changeArea={changeArea} />);

    navigation.find('.accounts').simulate('click');
    assert(changeArea.calledOnce);
  });
});
