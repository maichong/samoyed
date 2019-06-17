import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface CheckboxFieldProps extends FieldProps<boolean, string> {
}

export default class CheckboxField extends React.Component<CheckboxFieldProps> {
}