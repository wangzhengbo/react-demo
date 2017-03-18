import React, { Component } from 'react';
import { render } from 'react-dom';
import List from './myList';
import { data, colors } from './myList.data';

render(
  <List data={ data } colors={ colors }/>,
  document.getElementById('app')
);
