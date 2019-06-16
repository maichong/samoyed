import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface TextFieldProps extends FieldProps<string, string> {
}

export default class TextField extends React.Component<TextFieldProps> {
}
