import React, { Component } from 'react'
import { connect } from 'react-redux'

class Stats extends Component {
    render() {
        return (
            <div>
                
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    list: state.record.list,
    eventId: state.record.eventId,
    count: state.record.count
})

export default connect(mapStateToProps)(Stats)