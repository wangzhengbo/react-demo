import React from 'react'

test.only('myList test', () => {
  console.log('#######test');
  const myMock = jest.fn();

  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();

  console.log(myMock.mock.instances);
});

test('this will be the only test that runs', () => {


  expect(true).toBe(false);
});

test('this test will not run', () => {
  expect('A').toBe('A');
});
