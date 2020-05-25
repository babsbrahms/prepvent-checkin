import React, { Component } from 'react';
import { Input, Menu, Segment, Card, Icon, Form, Message, Button } from 'semantic-ui-react';
import BarcodeReader from 'react-barcode-reader';
import { connect } from 'react-redux';
import { localCheckInAction, localCheckOutAction } from "../action/record"

class Registration extends Component {
  constructor (props) {
    super(props);

    this.state = { 
      activeItem: 'scan', 
      number: '', 
      loading: false,
      data: {

      },
      ready: false,
      dataIndex: -1
    }

    this.input = React.createRef()
  }
  

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  handleScan = (data) => {
    this.setState({
      number: data,
    }, () => {
      this.onSubmit()
    })
  }
  handleError = (err) => {
    console.error(err)
  }

  onSubmit = () => {
    const { number } = this.state;
    const {list, addAlert, removeAlert, schema, method } = this.props;

    removeAlert()

    this.setState({ loading: true }, () => {
      if (method === 'local') {
        let index = list.findIndex(x => x[schema.ID] === number);

        if (index >= 0) { 
          this.setState({ data: list[index], loading: false, dataIndex: index })
        } else {
          addAlert('Error', 'Record not found', false, false)
          this.setState({ data: { }, loading: false})
        } 

      } else {

      }
    }) 
  }

  changeStatus = (index, id, status, group) => {
    const { localCheckOut, localCheckIn, addAlert, method } = this.props;
    this.setState({ loading: true }, () => {
      if (method === 'local') {
        if (status) {
          localCheckOut(index, group)
          .then(() => {
            this.setState({ data: { }, loading: false, number: '', dataIndex: -1 })
          })
          .catch(() => {
            addAlert('Error', 'Problem checking out', false, false);
            this.setState({ loading: false, number: '' })
          })
        } else {
          localCheckIn(index, group)
          .then(() => {
            this.setState({ data: { }, loading: false, number: '', dataIndex: -1 })
          })
          .catch(() => {
            addAlert('Error', 'Problem checking in', false, false);
            this.setState({ loading: false, number: '' })
          })
        }
      } else {
        
      }

      if (this.input) {
        this.input.focus()   
      }
    })
  }

  render() {
    const { activeItem, number, loading, data, dataIndex } = this.state;
    const { count, schema, keys } = this.props;

    return (
      <div>
        <Menu attached='top' tabular>
          <Menu.Item
            name='scan'
            icon='barcode'
            active={activeItem === 'scan'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='input'
            icon="pencil"
            active={activeItem === 'input'}
            onClick={this.handleItemClick}
          />
          {/* <Menu.Menu position='right'>
            <Menu.Item>
              <Input
                transparent
                icon={{ name: 'search', link: true }}
                placeholder='Search users...'
              />
            </Menu.Item>
          </Menu.Menu> */}
        </Menu>

        <Segment loading={loading} attached='bottom'>
          <section>
            {(count === 0) && (<div>
              <Message info>
                <Message.Header>Info</Message.Header>
                <Message.Content>Add records to start the checkin process by pressing the <Icon name='content' /> icon and navigating to the records tab</Message.Content>
              </Message>
            </div>)}

            {(count > 0) && (!schema.ID) && (<div>
            <Message info>
                <Message.Header>Info</Message.Header>
                <Message.Content> Modify your record schema by pressing the <Icon name='content' /> icon and navigating to the records tab </Message.Content>
            </Message>
          </div>)}

            {(count > 0) && (!!schema.ID) && (<div>
              {(activeItem === 'scan') && (!loading) && (<div style={{ flex: 1 }}>
                <BarcodeReader
                  onError={this.handleError}
                  onScan={this.handleScan}
                />
              </div>)}


              {(activeItem === 'input') && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center'}}>
                <Form onSubmit={() => this.onSubmit()}>
                
                  <Input
                    ref={x => this.input = x}
                    value={number}
                    icon={<Icon name='filter' color='pink' inverted  link onClick={() => this.onSubmit()} />}
                    placeholder={`Enter ${schema.ID}`}
                    onChange={(e) => this.setState({ number: e.target.value })}
                  />
                </Form>
              </div>)}
            </div>)}
            
          </section>

          
            <br />
            <br />
            <br />

          <Card.Group centered>
            {keys.map( (key, index) => (<Card>
              <Card.Content key={index}>
                <Card.Header textAlign="center">
                  {key}
                </Card.Header>
                <Card.Meta textAlign="center">
                  {data[key]}
                </Card.Meta>
              </Card.Content>
            </Card>))}            
          </Card.Group>
          <br />
          <br />
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center"}}>
            {(dataIndex >= 0) && (<Button onClick={() => this.changeStatus(dataIndex, data[schema.ID], data._checkin_status, data[schema.group])} size={'big'} basic color={data._checkin_status? "red" : "blue"} >
                {data._checkin_status? "Check Out" : "Check In"}
            </Button>)}
          </div>

        </Segment>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  eventId: state.record.eventId,
  count: state.record.count,
  list: state.record.list,
  schema: state.schema,
  method: state.record.method,
  keys: state.record.keys
});

const mapDispatchToProps = {
  localCheckIn: localCheckInAction, 
  localCheckOut: localCheckOutAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)