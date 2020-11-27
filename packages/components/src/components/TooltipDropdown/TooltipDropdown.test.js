/*
Copyright 2019-2020 The Tekton Authors
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';
import { fireEvent } from 'react-testing-library';

import { renderWithIntl } from '../../utils/test';
import TooltipDropdown from './TooltipDropdown';

const props = {
  id: 'tooltip-dropdown-id',
  items: ['item 1', 'item 2', 'item 3', { id: '*', text: 'label' }],
  label: 'select an item',
  loading: false,
  onChange: () => {}
};

const initialTextRegExp = new RegExp('select an item', 'i');

it('TooltipDropdown renders', () => {
  const {
    getByText,
    getByPlaceholderText,
    queryByText,
    queryByValue
  } = renderWithIntl(<TooltipDropdown {...props} />);
  fireEvent.click(getByPlaceholderText(initialTextRegExp));
  props.items.forEach(item => {
    expect(queryByText(new RegExp(item, 'i'))).toBeTruthy();
  });
  fireEvent.click(getByText(/item 1/i));
  expect(queryByValue(/item 1/i)).toBeTruthy();
});

it('TooltipDropdown renders selected item', () => {
  const { queryByValue } = renderWithIntl(
    <TooltipDropdown {...props} selectedItem={{ text: 'item 1' }} />
  );
  expect(queryByValue(/item 1/i)).toBeTruthy();
});

it('TooltipDropdown renders empty', () => {
  const { queryByPlaceholderText } = renderWithIntl(
    <TooltipDropdown {...props} items={[]} />
  );
  expect(queryByPlaceholderText(/no items found/i)).toBeTruthy();
  expect(queryByPlaceholderText(initialTextRegExp)).toBeFalsy();
});

it('TooltipDropdown renders loading skeleton', () => {
  const { queryByPlaceholderText } = renderWithIntl(
    <TooltipDropdown {...props} loading />
  );
  expect(queryByPlaceholderText(initialTextRegExp)).toBeFalsy();
});

it('TooltipDropdown handles onChange event', () => {
  const onChange = jest.fn();
  const { getByPlaceholderText, getByText } = renderWithIntl(
    <TooltipDropdown {...props} onChange={onChange} />
  );
  fireEvent.click(getByPlaceholderText(initialTextRegExp));
  fireEvent.click(getByText(/item 1/i));
  expect(onChange).toHaveBeenCalledTimes(1);
});
