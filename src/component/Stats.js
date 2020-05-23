import React, { Component } from 'react';
import { Menu, Segment, Message, Statistic } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";

class Stats extends Component {
    state = { 
        activeItem: 'turn out',
        turnOut: [],
        turnOutReady: false,
        allGroups: [],
        allGroupsReady: false,
        checkedGroups: [],
        checkedGroupsReady: false
    }

    componentDidMount() {
        const { count } = this.props;

        if (count !== 0) {
            this.makeLocalTurnOut()
        } 
    }
    
    makeLocalTurnOut = () => {
        const {  count, checked } = this.props;
        
        // let checkin = list.filter(x => x.checkin_status === true).length

        // let total = list.length;

        // let no_show = total - checkin

        this.setState({ 
            turnOut: [
                {x: 1, y: checked},
                {x: 2, y: count},
                {x: 3, y: (count - checked)},
            ],
            turnOutReady: true
        })
        
    }

    makeLocalAllGroup = () => {
        const {  list } = this.props;
        let groups = [];

        list.forEach(x => {

            let index = groups.findIndex(i => i.x === x.ticketName);

            if (index < 0) {
                groups.push({ x: x.ticketName, y: 1 })
            } else {
                groups[index].y = groups[index].y + 1;
            }
        })
        
        this.setState({ 
            allGroups: groups,
            allGroupsReady: true
        })
        
    }

    makeLocalCheckedGroup = () => {
        const {  list } = this.props;
        let groups = [];

        list.forEach(x => {
            if (x.checkin_status === true) {
                let index = groups.findIndex(i => i.x === x.ticketName);

                if (index < 0) {
                    groups.push({ x: x.ticketName, y: 1 })
                } else {
                    groups[index].y = groups[index].y + 1;
                }

            }
        })
        
        this.setState({ 
            checkedGroups: groups,
            checkedGroupsReady: true
        })
        
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name }, () => {
        if (name === 'all groups' && !this.state.allGroupsReady) {
            this.makeLocalAllGroup()
        } else if (name === 'checked in Groups' && !this.state.checkedGroupsReady) {
            this.makeLocalCheckedGroup()
        }
    })

    render() {
        const { activeItem, turnOut, allGroups, allGroupsReady, turnOutReady, checkedGroups, checkedGroupsReady } = this.state;
        const { count, checked } = this.props;

        return (
            <div>
                <Segment inverted>
                    <Menu inverted pointing secondary>
                    <Menu.Item
                        name='turn out'
                        active={activeItem === 'turn out'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='all groups'
                        active={activeItem === 'all groups'}
                        onClick={this.handleItemClick}
                    />
                    {(checked > 0) && (
                    <Menu.Item
                        name='checked in Groups'
                        active={activeItem === 'checked in Groups'}
                        onClick={this.handleItemClick}
                    />)}
                    </Menu>
                </Segment>

                {(count === 0) && (<div>
                    <Message info>
                        <Message.Header>Info</Message.Header>
                        <Message.Content>Add records to show stats</Message.Content>
                    </Message>
                </div>)}


                
                {(count > 0) && (<div>

                    {(activeItem === 'turn out') && (
                    <Segment loading={!turnOutReady}>
                        {(turnOutReady) && (
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Statistic.Group>
                                <Statistic>
                                    <Statistic.Label>Check In</Statistic.Label>
                                    <Statistic.Value>{turnOut[0].y}</Statistic.Value>
                                </Statistic>

                                <Statistic>
                                    <Statistic.Label>Total</Statistic.Label>
                                    <Statistic.Value>{turnOut[1].y}</Statistic.Value>
                                </Statistic>

                                <Statistic>
                                    <Statistic.Label>No Show</Statistic.Label>
                                    <Statistic.Value>{turnOut[2].y}</Statistic.Value>
                                </Statistic>
                            </Statistic.Group>

                            <VictoryChart
                            theme={VictoryTheme.material}
                            domainPadding={20}
                            >
                                <VictoryAxis
                                    // tickValues specifies both the number of ticks and where
                                    // they are placed on the axis
                                    tickValues={[1, 2, 3]}
                                    tickFormat={["Check In", "Total", "No Show"]}
                                />

                                <VictoryAxis
                                    dependentAxis
                                    // tickFormat specifies how ticks should be displayed
                                    tickFormat={(x) => (`${x}`)}
                                />
                                <VictoryBar
                                // style={{ data: { fill: "#c43a31" } }}
                                    data={turnOut}
                                    animate={{
                                        duration: 2000,
                                        onLoad: { duration: 1000 }
                                    }}
                                />
                            </VictoryChart>

                        </div>)}
                    </Segment>)}

                    {(activeItem === 'all groups') && (
                    <Segment loading={!allGroupsReady}>
                        {(allGroupsReady) && (
                            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Statistic.Group>
                                    {allGroups.map(group => (
                                    <Statistic key={group.x}>
                                        <Statistic.Label>{group.x}</Statistic.Label>
                                        <Statistic.Value>{group.y}</Statistic.Value>
                                    </Statistic>
                                    ))}
                                </Statistic.Group>
                                <VictoryPie
                                data={allGroups}
                                animate={{
                                    duration: 2000
                                }}
                                //labels={({ datum }) => `${datum.x}: ${datum.y}`}
                                />

                            </div>
                        )}
                    </Segment>)}

                    {(activeItem === 'checked in Groups') && (
                    <Segment loading={!checkedGroupsReady}>
                        {(checkedGroupsReady) && (
                        <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Statistic.Group>
                                {checkedGroups.map(group => (
                                <Statistic key={group.x}>
                                    <Statistic.Label>{group.x}</Statistic.Label>
                                    <Statistic.Value>{group.y}</Statistic.Value>
                                </Statistic>
                                ))}
                            </Statistic.Group>
                            <VictoryPie
                                data={checkedGroups}
                                animate={{
                                    duration: 2000
                                }}
                            />
                        </div>)}
                    </Segment>)}
                </div>)}
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    list: state.record.list,
    eventId: state.record.eventId,
    count: state.record.count,
    checked: state.record.checked
})

export default connect(mapStateToProps)(Stats)