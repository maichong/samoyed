import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface ImageFieldProps extends FieldProps<string | string[], string> {
  apiUrl?: string;
  allowed?: string[];
  maxSize?: number;
}

export default class ImageField extends React.Component<ImageFieldProps> {
}
