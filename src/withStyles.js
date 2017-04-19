/**
 * Isomorphic CSS style loader for Webpack
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withStyles(...styles) {
  return (WrappedComponent) => class WithStyles extends Component {
    static contextTypes = {
      insertCss: PropTypes.func.isRequired,
    };

    static displayName = `WithStyles(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;

    componentWillMount() {
      this.removeCss = this.context.insertCss.apply(undefined, styles);
    }

    componentWillUnmount() {
      setTimeout(this.removeCss, 0);
    }

    getWrappedInstance(...rest) {
      const levelsOfWrapping = rest.length <= 0
        || rest[0] === undefined ?
        1 :
        rest[0];
      let wrappedInstance = this.refs.wrappedInstance;
      let i = levelsOfWrapping;
      for (i; i > 1; i--) {
        wrappedInstance = wrappedInstance.getWrappedInstance(i - 1);
      }
      return wrappedInstance;
    }

    render() {
      return <WrappedComponent ref="wrappedInstance" {...this.props} />;
    }
  };
}

export default withStyles;
