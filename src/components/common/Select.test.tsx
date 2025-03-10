import React from 'react'
import { render } from '@testing-library/react'
import Select from './Select'

it('renders without crashing', () => {
  const { container } = render(
    <Select
      title="The title"
      options={[
        {
          version: 'one option',
          createApp: '',
        },
        {
          version: 'other option',
          createApp: '',
        },
      ]}
      value="one option"
    />
  )

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="css-1ago99h"
      >
        <h4>
          The title
        </h4>
        <div
          class="ant-select css-1ago99h ant-select-lg ant-select-single ant-select-show-arrow"
        >
          <div
            class="ant-select-selector"
          >
            <span
              class="ant-select-selection-search"
            >
              <input
                aria-activedescendant="rc_select_TEST_OR_SSR_list_0"
                aria-autocomplete="list"
                aria-controls="rc_select_TEST_OR_SSR_list"
                aria-haspopup="listbox"
                aria-owns="rc_select_TEST_OR_SSR_list"
                autocomplete="off"
                class="ant-select-selection-search-input"
                id="rc_select_TEST_OR_SSR"
                readonly=""
                role="combobox"
                style="opacity: 0;"
                value=""
              />
            </span>
            <span
              class="ant-select-selection-item"
            >
              one option
            </span>
          </div>
          <span
            aria-hidden="true"
            class="ant-select-arrow"
            style="user-select: none;"
            unselectable="on"
          >
            <span
              aria-label="down"
              class="anticon anticon-down"
              role="img"
            >
              <svg
                aria-hidden="true"
                class=""
                data-icon="down"
                fill="currentColor"
                focusable="false"
                height="1em"
                viewBox="64 64 896 896"
                width="1em"
              >
                <path
                  d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  `)
})
