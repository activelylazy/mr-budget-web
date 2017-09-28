import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import Navigation from './NavigationComponent';
import * as areas from './navigation-areas';

should();

describe('navigation component', () => {
  it('renders links', () => {
    const navigation = shallow(<Navigation changeArea={sinon.stub()} currentArea={areas.ACCOUNTS} />);

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

  it('renders categories as active', () => {
    const navigation = shallow(<Navigation changeArea={sinon.stub()} currentArea={areas.CATEGORIES} />);

    assert(navigation.find('.accounts').prop('active').should.equal(false));
    assert(navigation.find('.categories').prop('active').should.equal(true));
    assert(navigation.find('.review').prop('active').should.equal(false));
    assert(navigation.find('.import').prop('active').should.equal(false));
  });

  it('changes to accounts area', () => {
    const changeArea = sinon.spy();
    const navigation = shallow(<Navigation changeArea={changeArea} currentArea={areas.CATEGORIES} />);

    navigation.find('.accounts').simulate('click');
    assert(changeArea.calledWith('ACCOUNTS'));
  });

  it('changes to categories area', () => {
    const changeArea = sinon.spy();
    const navigation = shallow(<Navigation changeArea={changeArea} currentArea={areas.ACCOUNTS} />);

    navigation.find('.categories').simulate('click');
    assert(changeArea.calledWith('CATEGORIES'));
  });

  it('changes to review area', () => {
    const changeArea = sinon.spy();
    const navigation = shallow(<Navigation changeArea={changeArea} currentArea={areas.ACCOUNTS} />);

    navigation.find('.review').simulate('click');
    assert(changeArea.calledWith('REVIEW'));
  });

  it('changes to import area', () => {
    const changeArea = sinon.spy();
    const navigation = shallow(<Navigation changeArea={changeArea} currentArea={areas.ACCOUNTS} />);

    navigation.find('.import').simulate('click');
    assert(changeArea.calledWith('IMPORT'));
  });
});
