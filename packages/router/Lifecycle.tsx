import * as React from 'react';
import * as H from 'history';

interface LifecycleProps {
  to: H.LocationDescriptor;
  onMount?: (cmp: React.Component<LifecycleProps>) => void;
  onUpdate?: (cmp: React.Component<LifecycleProps>, prevProps: LifecycleProps) => void;
  onUnmount?: (cmp: React.Component<LifecycleProps>) => void;
}

export default class Lifecycle extends React.Component<LifecycleProps> {
  componentDidMount() {
    if (this.props.onMount) this.props.onMount.call(this, this);
  }

  componentDidUpdate(prevProps: LifecycleProps) {
    if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps);
  }

  componentWillUnmount() {
    if (this.props.onUnmount) this.props.onUnmount.call(this, this);
  }

  render(): any {
    return null;
  }
}
