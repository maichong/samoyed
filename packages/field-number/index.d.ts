import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface NumberFieldProps extends FieldProps<number, string> {
}

export default class NumberField extends React.Component<NumberFieldProps> {
}
