import React, { Component } from 'react'
import { Dropdown, Icon, Menu, Segment, Table, Input, Select, Button, Message } from 'semantic-ui-react'
import * as csv from "csvtojson";
import { connect } from 'react-redux'
import validator from 'validator';
import { addRecordAction } from '../action/record'

const options = [
  { key: 'all', text: 'Name', value: 'fullname' },
  { key: 'registation', text: 'Registration Number', value: 'registrationNumber' },
  { key: 'contact', text: 'Contact', value: 'contact' },
  { key: 'ticketNam', text: 'Ticket Name', value: 'ticketName' },
];

class Records extends Component {
    constructor(props) {
        super(props);
        this.state = {
          list: []
        }

        this.uploader = React.createRef()
    }

    onUpload = e => {
        const { addAlert } = this.props;
      console.log(e.target.files[0]);
      
      // Check for the various File API support.
        e.preventDefault()
        if (e.target.files.length > 0) {
            if (window.FileReader) {
                if (e.target.files[0].type === "text/csv" || "application/vnd.ms-excel") {
                    // FileReader are supported.;
                    var reader = new FileReader();
                    // Read file into memory as UTF-8      
                    reader.readAsText(e.target.files[0]);
                    // Handle errors load
                    reader.onload = (event) => {
                        var csvString = reader.result;
                        console.log("csvString: ", csvString);
                        
                        addAlert('Success', `Fetching data`, true, false)
                        this.formatList(csvString)

                    };
                    reader.onerror = (evt) => {
                        if(evt.target.error.name === "NotReadableError") {
                            addAlert('Error', "Canno't read file !", false, false)
                        }
                    }
                } else {
                    addAlert('Warning', 'The file seleceted is not a csv file-type. Checkout out some information about csv files with the link above the import button', false, false)
                }
            } else {
                addAlert('Error', 'FileReader are not supported in this browser', false, false)
            }

        }
    }


    formatList = (csvString) => {
      const { addAlert, addRecord } = this.props;

      csv({
        // output: "csv"
      })
      .fromString(csvString)
      .then((result) =>{
      

          //let contact = result.map(res =>(res.phone))
          addAlert('Success', `Got ${result.length} list`, true, false)

          addRecord({ list: result, count: result.length})
          
      })
      .catch(err => {
          addAlert('Error', 'Error converting csv file', false, false)
      })
    }

    addCsv = () => {
      document.getElementById('list-uploader').click()
    }


  getRegistrationList = () => {
      const { list } = this.props;
      // csvtojson({})
      this.startDownload(`Registeration List.csv`, list);

  }

  startDownload = (filename, text) => {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
  
      element.style.display = 'none';
      document.body.appendChild(element);
  
      element.click();
  
      document.body.removeChild(element);
  }

    render () {
      const { list, count } = this.props;
      return (
        <div>
          {(count === 0) && (<div>
            <Message info>
                <Message.Header>Info</Message.Header>
                <Message.Content>Info records using the <Icon name='wrench' /> icon </Message.Content>
            </Message>
        </div>)}
        <Menu attached='top'>
          <Dropdown item icon='wrench' simple>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Icon name='dropdown' />
                <span className='text'>Import</span>
    
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => this.addCsv() }>from csv</Dropdown.Item>
                  <Dropdown.Item disabled>from PrepVENT</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item>
              <Dropdown.Item disabled={count === 0} >
              <Icon name='dropdown' />
                <span className='text'>Save</span>
    
                <Dropdown.Menu>
                  <Dropdown.Item>Locally</Dropdown.Item>
                  <Dropdown.Item disabled>Online</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Item>
              {/* <Dropdown.Divider />
              <Dropdown.Header>Export</Dropdown.Header>
              <Dropdown.Item>Share</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
    
          <Menu.Menu position='right'>
            <Input type='text' placeholder='Search...' action>
              <input />
              <Select compact options={options} defaultValue='fullname' />
              <Button type='submit'>Search</Button>
            </Input>
            {/* <div className='ui right aligned category search item'>
              <div className='ui transparent icon input'>
                <input
                  className='prompt'
                  type='text'
                  placeholder='Search records...'
                />
                <i className='search link icon' />
              </div>
              <div className='results' />
            </div> */}
          </Menu.Menu>
        </Menu>
        {(<div style={{ height: 0, width: 0}}>
          <Input ref={x => this.uploader = x} id={'list-uploader'} type= 'file' onChange={this.onUpload} />
        </div>)}
        <Segment attached='bottom'>
        <Table celled>
          <Table.Header>
            <Table.Row>
              {/* <Table.HeaderCell>Id</Table.HeaderCell> */}
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Registration Number</Table.HeaderCell>
              <Table.HeaderCell>Contact</Table.HeaderCell>
              <Table.HeaderCell>Ticket Name</Table.HeaderCell>
              <Table.HeaderCell>Checkin Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
    
          <Table.Body>
            {list.map((li, i) => (
              <Table.Row key={i} positive>
                <Table.Cell>{li.fullname}</Table.Cell>
                <Table.Cell>{li.registrationNumber}</Table.Cell>
                <Table.Cell>{li.contact}</Table.Cell>
                <Table.Cell>{li.ticketName}</Table.Cell>
                <Table.Cell><Icon name={li.checkin_status? "checkmark": "close"} color={li.checkin_status? "green": "red"} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        </Segment>
      </div>
      )
    }
}

const mapStateToProps = (state) => ({
  list: state.record.list,
  eventId: state.record.eventId,
  count: state.record.count
})

const mapDispatchToProps = {
  addRecord: addRecordAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Records)
