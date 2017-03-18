import React from 'react';
import { shallow, render, mount } from 'enzyme';
import List, { EditableListItem } from './myList';
import { data, colors } from './myList.data';

function deleteItem(item) {
  item.find('button').first().simulate('click');
};

function editItem(item) {
  const button = item.find('button').last();
  expect(button.text()).toBe('编辑');
  button.simulate('click');
};

function saveItem(item) {
  const button = item.find('button').last();
  expect(button.text()).toBe('保存');
  button.simulate('click');
};

function setContent(item, content) {
  const input = item.find('input');
  expect(input.length).toBe(1);
  input.simulate('change', { target: { value: content } });
};

function setColor(item, color) {
  const select = item.find('select');
  expect(select.length).toBe(1);
  select.simulate('change', { target: { value: color } });
};

function expectSaveButton(item, disabled) {
  const buttons = item.find('button');
  expect(buttons.length).toBe(2);

  const saveButton = buttons.last();
  expect(saveButton.text()).toBe('保存');
  expect(saveButton.prop('disabled')).toBe(disabled);
  if (disabled) {
    expect(saveButton.prop('title')).toBe('请输入文本');
  } else {
    expect(saveButton.prop('title')).toBe('');
  }
}

function expectItemMatchData(item, itemData, inEditMode) {
  expect(item.getNode().style.backgroundColor).toBe(itemData.bgColor);

  const contentSpan = item.find('span.content');
  const input = item.find('input');
  const select = item.find('select');

  if (inEditMode) {
    expect(input.length).toBe(1);
    expect(input.getNode().value).toBe(itemData.content);
    expect(select.length).toBe(1);
    expect(select.getNode().value).toBe(itemData.bgColor);
    expect(contentSpan.length).toBe(0);
  } else {
    expect(input.length).toBe(0);
    expect(select.length).toBe(0);
    expect(contentSpan.length).toBe(1);
    expect(contentSpan.text()).toBe(itemData.content);
  }

  const buttons = item.find('button');
  expect(buttons.length).toBe(2);
  expect(buttons.first().text()).toBe('删除');

  if (inEditMode) {
    const saveButton = buttons.last();
    expect(saveButton.text()).toBe('保存');
    const disabled = (itemData.content || '') === '';
    expect(saveButton.prop('disabled')).toBe(disabled);
    if (disabled) {
      expect(saveButton.prop('title')).toBe('请输入文本');
    } else {
      expect(saveButton.prop('title')).toBe('');
    }
  } else {
    const editButton = buttons.last();
    expect(editButton.text()).toBe('编辑');
    expect(editButton.prop('disabled')).toBeUndefined();
    expect(editButton.prop('title')).toBeUndefined();
  }
};

describe('<List />', () => {
  it('renders three <EditableListItem /> components', () => {
    const wrapper = shallow(<List data={data} colors={colors} />);
    expect(wrapper.find(EditableListItem).length).toBe(3);
  });

  it('renders each <EditableListItem /> component with backgroundColor and content', () => {
    const wrapper = mount(<List data={data} colors={colors} />);
    const items = wrapper.find('ul li');
    expect(items.length).toBe(3);

    data.forEach((itemData, index) => {
      expectItemMatchData(items.at(index), itemData, false);
    });
  });

  it('renders an add item button', () => {
    const wrapper = shallow(<List data={data} colors={colors} />);

    const buttons = wrapper.find('div.list-container > button');
    expect(buttons.length).toBe(1);
    expect(buttons.at(0).text()).toBe('新建');
  });

  it('delete item when delete button clicked', () => {
    const wrapper = mount(<List data={data} colors={colors} />);
    const items = wrapper.find('ul li');
    expect(items.length).toBe(3);

    // delete the second item
    deleteItem(items.at(1));
    let newItems = wrapper.find('ul li');
    expect(newItems.length).toBe(items.length - 1);
    expectItemMatchData(newItems.at(0), data[0], false);
    expectItemMatchData(newItems.at(1), data[2], false);

    // delete the first item
    deleteItem(items.first());
    newItems = wrapper.find('ul li');
    expect(newItems.length).toBe(items.length - 2);
    expectItemMatchData(newItems.at(0), data[2], false);

    // delete the last item
    deleteItem(items.last());
    newItems = wrapper.find('ul li');
    expect(newItems.length).toBe(0);
  });

  it(`edit item's content`, () => {
    const wrapper = mount(<List data={data} colors={colors} />);
    const items = wrapper.find('ul li');
    expect(items.length).toBe(3);

    const item = items.at(1);
    editItem(item);
    expectItemMatchData(item, {
      ...data[1]
    }, true);

    const newContent = 'newValueForSecondItem';
    setContent(item, newContent);
    expectItemMatchData(item, {
      ...data[1],
      content: newContent
    }, true);

    saveItem(item);
    expectItemMatchData(item, {
      ...data[1],
      content: newContent
    }, false);

    editItem(item);
    expectItemMatchData(item, {
      ...data[1],
      content: newContent
    }, true);

    // set content to empty value
    setContent(item, '  ');
    expectSaveButton(item, true);

    // set content to not empty value
    setContent(item, newContent);
    expectSaveButton(item, false);
  });

  it(`edit item's color`, () => {
    const wrapper = mount(<List data={data} colors={colors} />);
    const items = wrapper.find('ul li');
    expect(items.length).toBe(3);

    const item = items.at(1);
    editItem(item);
    expectItemMatchData(item, {
      ...data[1]
    }, true);

    const newColor = 'yellow';
    expect(newColor).not.toBe(data[1].bgColor);
    setColor(item, newColor);
    expectItemMatchData(item, {
      ...data[1],
      bgColor: newColor
    }, true);

    saveItem(item);
    expectItemMatchData(item, {
      ...data[1],
      bgColor: newColor
    }, false);

    editItem(item);
    expectItemMatchData(item, {
      ...data[1],
      bgColor: newColor
    }, true);
  });

  it(`add list item when add item button clicked, edit item's content and color, and then save item`, () => {
    const wrapper = mount(
      <List data={data} colors={colors} />
    );
    const items = wrapper.find('div.list-container ul li');

    const addButton = wrapper.find('div.list-container > button');
    addButton.simulate('click');

    let newItems = wrapper.find('div.list-container ul li');
    expect(newItems.length).toBe(items.length + 1);

    const newItem = newItems.last();

    // new added item is in edit mode
    expectItemMatchData(newItem, {
      content: '',
      bgColor: colors[0]
    }, true);

    expectSaveButton(newItem, true);

    // set content and color, then save item config
    const newContent = 'newValueForSecondItem';
    setContent(newItem, newContent);
    const newColor = 'yellow';
    setColor(newItem, newColor);
    saveItem(newItem);

    expectItemMatchData(newItem, {
      content: newContent,
      bgColor: newColor
    }, false);

    editItem(newItem);
    expectItemMatchData(newItem, {
      content: newContent,
      bgColor: newColor
    }, true);

    newItems = wrapper.find('div.list-container ul li');
    expect(newItems.length).toBe(items.length + 1);
  });
});
