import React, { Component } from 'react';
import { Input, Menu, Segment, Card, Icon, Form, Message, Button } from 'semantic-ui-react';
import BarcodeReader from 'react-barcode-reader';
import { connect } from 'react-redux';
import { CheckInAction, CheckOutAction } from "../action/record"

class Registration extends Component {
  state = { 
    activeItem: 'scan', 
    number: '', 
    loading: false,
    data: {

    },
    ready: false
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
    const {list, addAlert, removeAlert} = this.props;

    removeAlert()
    let index = list.findIndex(x => x.registrationNumber === number)
    
    if (index >= 0) {
      this.setState({ data: { ...list[index], index }})
    } else {
      addAlert('Error', 'Record not found', false, false)
      this.setState({ data: { }})
    }  
  }

  changeStatus = (id, status) => {
    const { checkin, checkout, addAlert } = this.props;
    this.setState({ loading: true }, () => {
      if (status) {
        checkout(id)
        .then(() => {
          this.setState({ data: { }, loading: false, number: '' })
        })
        .catch(() => {
          addAlert('Error', 'Problem checking out', false, false);
          this.setState({ loading: false, number: '' })
        })
      } else {
        checkin(id)
        .then(() => {
          this.setState({ data: { }, loading: false, number: '' })
        })
        .catch(() => {
          addAlert('Error', 'Problem checking in', false, false);
          this.setState({ loading: false, number: '' })
        })
      }
    })
  }

  render() {
    const { activeItem, number, loading, data } = this.state;
    const { count, eventId } = this.props;

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
                <Message.Content>Add records to start the checkin process</Message.Content>
              </Message>
            </div>)}

            {(count > 0) && (<div>
              {(activeItem === 'scan') && (<div style={{ flex: 1 }}>
                <BarcodeReader
                  onError={this.handleError}
                  onScan={this.handleScan}
                />
              </div>)}


              {(activeItem === 'input') && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: 'center'}}>
                <Form onSubmit={() => this.onSubmit()}>
                
                  <Input
                    value={number}
                    icon={<Icon name='filter' color='pink' inverted  link onClick={() => this.onSubmit()} />}
                    placeholder='Enter Registration Number'
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
            <Card>
              <Card.Content>
                <Card.Header textAlign="center">
                  Name
                </Card.Header>
                <Card.Meta textAlign="center">
                  {data.fullname}
                </Card.Meta>
              </Card.Content>
            </Card>


            <Card>
              <Card.Content>
                <Card.Header textAlign="center">
                  Registration Number
                </Card.Header>
                <Card.Meta textAlign="center">
                  {data.registrationNumber}
                </Card.Meta>
              </Card.Content>
            </Card>


            <Card>
              <Card.Content>
                <Card.Header textAlign="center">
                  Contact
                </Card.Header>
                <Card.Meta textAlign="center">
                  {data.contact}
                </Card.Meta>
              </Card.Content>
            </Card>



            <Card>
              <Card.Content>
                <Card.Header textAlign="center">
                 Ticket Name
                </Card.Header>
                <Card.Meta textAlign="center">
                    {data.ticketName}
                </Card.Meta>
              </Card.Content>
            </Card>
            
          </Card.Group>
          <br />
          <br />
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: "center"}}>
            {(data.index >= 0) && (<Button onClick={() => this.changeStatus(data.index, data.checkin_status)} size={'big'} basic color={data.checkin_status? "red" : "blue"} >
                {data.checkin_status? "Check Out" : "Check In"}
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
  list: state.record.list
})

export default connect(mapStateToProps, { checkin:CheckInAction, checkout: CheckOutAction})(Registration)