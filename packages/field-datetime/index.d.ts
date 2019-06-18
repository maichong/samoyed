import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface DatetimeFieldProps extends FieldProps<string, string> {
  locale?: string;
}

export default class DatetimeField extends React.Component<DatetimeFieldProps> {
}
