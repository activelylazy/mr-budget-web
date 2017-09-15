import React from 'react';
import { PropTypes } from 'prop-types';

const tab = (selectedTab, tabTitle, onClick) => (
  <li className={selectedTab === tabTitle ? 'active' : ''}>
    <a onClick={onClick} tabIndex="-1">{tabTitle}</a>
  </li>
);

export class Tabs extends React.Component {
  componentWillMount() {
    this.setState({ selectedTab: '' });
  }

  select(tabTitle) {
    this.setState({ selectedTab: tabTitle });
  }

  createTab(activeTab, child) {
    return tab(activeTab.props.title, child.props.title, () => this.select(child.props.title));
  }

  render() {
    const { selectedTab } = this.state;
    const children = React.Children.toArray(this.props.children);
    let activeTab = children.find(c => c.props.title === selectedTab);
    if (activeTab === undefined) {
      activeTab = children[0];
    }
    const titles = React.Children
      .map(this.props.children, child => this.createTab(activeTab, child));

    return (
      <div className="tab-container">
        <div className="tab-content">
          {React.cloneElement(activeTab)}
        </div>
        <div className="tabs">
          <ul className="nav nav-tabs">
            {titles}
          </ul>
        </div>
      </div>
    );
  }
}

export class Tab extends React.Component {
  render() {
    const children = React.Children.map(this.props.children, child => React.cloneElement(child));
    return (
      <div className="tab">{children}</div>
    );
  }
}

Tab.propTypes = {
  title: PropTypes.string.isRequired,
};


