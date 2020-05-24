import React, { Component } from 'react'
import { Header, Icon, Message, Menu, Segment, Sidebar } from 'semantic-ui-react';
import Registration from './Registration';
import Stats from './Stats';
import Records from './Records'


export default class page extends Component {
  state = {
    activeItem: 'Records',
    visible: true,
    alert: {
      title: '',
      message: '',
      success: false,
      permernent: false
    }
  }

  change = name => this.setState({ activeItem: name, visible: false, alert: {} })

  addAlert = (t, m, s, p) => this.setState({ alert: { title: t, message: m, success: s, permernent: p }})

  removeAlert= () => this.setState({ alert: { }})

  render() {
    const { activeItem, visible, alert } = this.state;
    return (
    <div>

      
      <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation="push"
        icon='labeled'
        inverted
        vertical
        onHide={() => this.setState({ visible: false })}
        visible={visible}
        width='thin'
      >
        <Menu.Item onClick={() => this.change('Check In')} as='a'>
          <Icon name="check square outline" />
          Check In
        </Menu.Item>
        <Menu.Item onClick={() => this.change('Stats')} as='a'>
          <Icon name="chart bar" />
          Stats
        </Menu.Item>
        <Menu.Item onClick={() => this.change('Records')} as='a'>
          <Icon name="book" />
          Records
        </Menu.Item>
      </Sidebar>
  
      <Sidebar.Pusher >
        <Segment basic>
          <Segment inverted>
            <Header textAlign="center" as='h3'>{activeItem}</Header>
          </Segment>
          
          {(!!alert.message) && (<Message error={!alert.success} success={alert.success}>
            <Icon name='close' size='big' onClick={() => this.setState({ alert: {}})}/>
            <Message.Header>{alert.title}</Message.Header>
            <Message.Content>{alert.message}</Message.Content>
          </Message>)}
          
          <Icon name="content" size="big" onClick={() => this.setState({ visible: true })}/>
          <br />
          <br />
          {(activeItem === 'Check In') && (<Registration removeAlert={() => this.removeAlert()} addAlert={(t,m,s,p) => this.addAlert(t,m,s, p)} />)}
          {(activeItem === 'Stats') && (<Stats  removeAlert={() => this.removeAlert()} addAlert={(t,m,s,p) => this.addAlert(t,m,s, p)} />)}
          {(activeItem === 'Records') && (<Records  removeAlert={() => this.removeAlert()} addAlert={(t,m,s,p) => this.addAlert(t,m,s, p)} />)}
          <br />
          <br />
          <br />
          <br />
          <br />
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  </div>
    )
  }
}
