import React, { Component } from 'react'
import { Dropdown, Icon, Menu, Segment, Table, Input, Select, Button, Message, Modal, Header, Form, Divider } from 'semantic-ui-react'
import * as csv from "csvtojson";
import { connect } from 'react-redux'
import validator from 'validator';
import { addRecordAction, ModifySchemaAction } from '../action/record'


class Records extends Component {
    constructor(props) {
        super(props);
        this.state = {
          list: [],
          modalOpen: false,
          editSchema: props.schema,
          // keys: props.keys,
          searchField: '',
          searchValue: "",
          searchResult: []
        }

        this.uploader = React.createRef()
    }

    onUpload = e => {
      const { addAlert } = this.props;
      console.log(e.target.files[0]);
      let filename = e.target.files[0].name;
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
                        let csvString = reader.result;
                        
                        // console.log("csvString: ", csvString);
                        
                        addAlert('Success', `Fetching data`, true, false)
                        this.formatList(csvString, filename)   

                    };
                    reader.onerror = (evt) => {
                        if(evt.target.error.name === "NotReadableError") {
                            addAlert('Error', "Canno't read file !", false, false)
                        }
                    }
                } else {
                    addAlert('Warning', 'The file seleceted is not a csv file-type.', false, false)
                }
            } else {
                addAlert('Error', 'FileReader are not supported in this browser', false, false)
            }

        }
    }


    formatList = (csvString, filename) => {
      const { addAlert, addRecord } = this.props;

      csv({
        // output: "csv"
      })
      .fromString(csvString)
      .then((result) =>{
        
        if (result.length > 0) {
            //let contact = result.map(res =>(res.phone))
            addAlert('Success', `Got ${result.length} rows of data`, true, false)

            let keys = Object.keys(result[0]);

            addRecord({ list: result, count: result.length, keys, filename, method: 'local' })

            this.setState({ keys, modalOpen: true })
        } else {
            addAlert('Warning', 'The csv file is empty')
        }

          
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

  openModal = () => this.setState({ modalOpen: true, editSchema: this.props.schema })

  closeModal = () => this.setState({ modalOpen: false })

  changeSchema = (name, value) => this.setState({ editSchema: { ...this.state.editSchema, [name]: value }})

  saveSchema = () => {
    const { editSchema } = this.state;

    this.props.modifySchema(editSchema);

    this.closeModal()
  }

  changeSearchField = (value) => this.setState({ searchField: value })

  changeSearchValue = (value) => this.setState({ searchValue: value })

  searchList = () => {
    const { keys, method, list } = this.props;
    const { searchField, searchValue } = this.state;

    let field = searchField || keys[0];
    

    if (method === 'local') {

      this.setState({ searchResult: list.filter(x => x[field].toLocaleLowerCase() === searchValue.toLocaleLowerCase()) })
      
    } else {

    }

  }

  render () {
      const { list, count, schema, checked, keys } = this.props;
      const { editSchema }  =this.state;
      return (
        <div>
          {(count === 0) && (<div>
            <Message info>
                <Message.Header>Info</Message.Header>
                <Message.Content>Import records using the <Icon name='wrench' /> icon </Message.Content>
            </Message>
        </div>)}

        {(count > 0) && (!schema.ID) && (<div>
            <Message info>
                <Message.Header>Info</Message.Header>
                <Message.Content> Add ID key to your record schema by using the <Icon name='wrench' /> icon </Message.Content>
            </Message>
        </div>)}

        <Modal 
        open={this.state.modalOpen}
        onClose={this.closeModal}
        basic
        size='fullscreen'
        >
          <Header icon='archive' content='Modify Record Schema' />
          <Modal.Content>
            <Form>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Key</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                    <Table.HeaderCell>Description</Table.HeaderCell>
                    <Table.HeaderCell>Required</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Name</Table.Cell>
                    <Table.Cell><Dropdown defaultValue={editSchema.name} name="name" key={'name'} onChange={(e, { name, value}) => this.changeSchema(name, value)} clearable options={keys.map(x => ({ key: x, text: x, value: x }))} selection /></Table.Cell>
                    <Table.Cell>Name of attendees</Table.Cell>
                    <Table.Cell><Icon name="close" /></Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>ID</Table.Cell>
                    <Table.Cell>
                      <Dropdown defaultValue={editSchema.ID} name="ID" key={'id'} onChange={(e, { name, value}) => this.changeSchema(name, value)}  clearable options={keys.map(x => ({ key: x, text: x, value: x }))} selection />
                      <Divider horizontal>Or</Divider>
                      <Button fluid basic color={'blue'}>GENERATE</Button>
                    </Table.Cell>
                    <Table.Cell>A unique identifier for each attendee in the rocord.</Table.Cell>
                    <Table.Cell><Icon name="checkmark" /></Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Group</Table.Cell>
                    <Table.Cell><Dropdown defaultValue={editSchema.group} name="group" key={'Group'} onChange={(e, { name, value}) => this.changeSchema(name, value)} clearable options={keys.map(x => ({ key: x, text: x, value: x }))} selection /></Table.Cell>
                    <Table.Cell>Use to categories attendees i.e. ticketName</Table.Cell>
                    <Table.Cell><Icon name="close" /></Table.Cell>
                  </Table.Row>

                  <Table.Row>
                    <Table.Cell>Contact</Table.Cell>
                    <Table.Cell><Dropdown defaultValue={editSchema.contact} name="contact" onChange={(e, { name, value}) => this.changeSchema(name, value)} key={'contact'} clearable options={keys.map(x => ({ key: x, text: x, value: x }))} selection /></Table.Cell>
                    <Table.Cell>Email or Phone number for sending "goodbye" message</Table.Cell>
                    <Table.Cell><Icon name="close" /></Table.Cell>
                  </Table.Row>
       
                  <Table.Row>
                    <Table.Cell>Checkin Status</Table.Cell>
                    <Table.Cell>{editSchema["Checkin Status"]}</Table.Cell>
                    <Table.Cell>Use internally to identify checkin status</Table.Cell>
                    <Table.Cell><Icon name="checkmark" /></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>


            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.closeModal()} basic color='red' inverted>
              <Icon name='remove' /> Discard
            </Button>
            <Button onClick={() => this.saveSchema()} color='green' inverted>
              <Icon name='checkmark' /> Save
            </Button>
          </Modal.Actions>
        </Modal>


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
              <Dropdown.Divider />
              {/* <Dropdown.Header>Export</Dropdown.Header> */}
              <Dropdown.Item 
              disabled={checked > 0} 
              onClick={() => this.openModal()}>Schema</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
    
          <Menu.Menu position='right'>
            <Input type='text' placeholder='Search...' onChange={(e, { value }) => this.changeSearchValue(value)} action>
              <input />
              <Select compact options={keys.map(x => ({ key: x, text: x, value: x }))} onChange={(e, { value }) => this.changeSearchField(value)} defaultValue='fullname' />
              <Button type='submit' disabled={keys.length === 0} onClick={() => this.searchList()}>Search</Button>
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
              {(schema.name) && (<Table.HeaderCell>{schema.name || "Name"}</Table.HeaderCell>)}
              <Table.HeaderCell>{schema.ID || "Registration Number"}</Table.HeaderCell>
              {(!!schema.contact) && (<Table.HeaderCell>{schema.contact || "Contact"}</Table.HeaderCell>)}
              {(!!schema.group) && (<Table.HeaderCell>{schema.group || "Group"}</Table.HeaderCell>)}
              <Table.HeaderCell>{schema["Checkin Status"] || "Checkin Status"}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
    
          <Table.Body>
            {list.map((li, i) => (
              <Table.Row key={i} positive>
                {(schema.name) && (<Table.Cell>{li[schema.name]}</Table.Cell>)}
                <Table.Cell>{li[schema.ID]}</Table.Cell>
                {(!!schema.contact) && (<Table.Cell>{li[schema.contact]}</Table.Cell>)}
                {(!!schema.group) && (<Table.Cell>{li[schema.group]}</Table.Cell>)}
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
  count: state.record.count,
  checked: state.record.checked,
  keys: state.record.keys,
  schema: state.schema,
  method: state.record.method
})

const mapDispatchToProps = {
  addRecord: addRecordAction,
  modifySchema: ModifySchemaAction
}

export default connect(mapStateToProps, mapDispatchToProps)(Records)
