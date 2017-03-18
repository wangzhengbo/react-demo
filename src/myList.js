import React, { Component } from 'react';
import './myList.less';

export class EditableListItem extends Component {
  static propTypes = {
    data: React.PropTypes.shape({
      id: React.PropTypes.number,
      content: React.PropTypes.string,
      bgColor: React.PropTypes.string,
    }).isRequired,
    colors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onDeleteItem: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      content: props.data.content || '',
      bgColor: props.data.bgColor || props.colors[0],
      inEditMode: !!props.data.inEditMode
    };

    this.saveItem = this.saveItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.onContentChange = this.onContentChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
  }

  saveItem() {
    this.setState({
      inEditMode: false
    });
  }

  editItem() {
    this.setState({
      inEditMode: true
    });
  }

  onContentChange(e) {
    this.setState({
      content: e.target.value
    });
  }

  onColorChange(e) {
    this.setState({
      bgColor: e.target.value
    });
  }

  render() {
    return (
      <li className="list-item" style={{backgroundColor: this.state.bgColor}}>
        <div>
          {
            this.state.inEditMode ? <input value={this.state.content} onChange={ this.onContentChange }/>
              : <span className="content">{this.state.content}</span>
          }

          {
            this.state.inEditMode &&
            <select value={ this.state.bgColor } onChange={ this.onColorChange }>
              {
                this.props.colors.map((color) => <option key={ color } value={ color }>{color}</option>)
              }
            </select>
          }

          <button onClick={ () => this.props.onDeleteItem(this.props.data) }>删除</button>
          {
            this.state.inEditMode &&
            <button onClick={ this.saveItem } disabled={this.state.content.trim() === ''} title={(this.state.content.trim() === '') ? '请输入文本' : ''}>保存</button>
          }
          {
            !this.state.inEditMode &&
            <button onClick={ this.editItem }>编辑</button>
          }
        </div>
      </li>
    );
  }
}

export default class List extends Component {
  static propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.number,
      content: React.PropTypes.string,
      bgColor: React.PropTypes.string,
    })).isRequired,
    colors: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      data: props.data
    };

    // next item id is current item's max id + 1
    this.nextId = this.state.data.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  deleteItem(item) {
    var newData = [ ...this.state.data ];
    newData.splice(newData.indexOf(item), 1);
    this.setState({
      data: newData
    });
  }

  addItem() {
    this.setState({
      data: [ ...this.state.data, {id: this.nextId++, inEditMode: true} ]
    });
  }

  render() {
    return (
      <div className="list-container">
        <ul className="list">
          {
            this.state.data.map((item, index) => <EditableListItem key={item.id} data={item}
              colors={this.props.colors} onDeleteItem={this.deleteItem}/> )
          }
        </ul>
        <button onClick={ this.addItem }>新建</button>
      </div>
    );
  }
}
