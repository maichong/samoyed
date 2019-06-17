import * as React from 'react';
import { FieldProps, SelectValue } from '@samoyed/types';

export interface SwitchFieldProps extends FieldProps<SelectValue | SelectValue[], string> {
}

export default class SwitchField extends React.Component<SwitchFieldProps> {
}
