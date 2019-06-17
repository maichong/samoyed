import * as React from 'react';
import { FieldProps, SelectValue } from '@samoyed/types';

export interface SelectFieldProps extends FieldProps<SelectValue | SelectValue[], string> {
}

export default class SelectField extends React.Component<SelectFieldProps> {
}
