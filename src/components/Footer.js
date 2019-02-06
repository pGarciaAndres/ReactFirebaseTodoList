import React, { Component } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default class Footer extends Component {
  render() {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <div style={{ color: '#a3a3a3' }}>
          Give someone else access to this todo list:
          <br />
          <Popup
            trigger={
              <CopyToClipboard text={window.location.href}>
                <span style={{ textDecoration: 'underline' }}>{window.location.href}</span>
              </CopyToClipboard>
            }
            inverted
            content="Click to copy url to clipboard"
            position="bottom center"
            size="mini"
          />
        </div>
        <Button
          onClick={() => {
            this.props.history.push('/')
          }}
          basic
          size="mini"
          style={{ marginTop: '10px' }}
        >
          Open a different todo list
        </Button>
      </div>
    )
  }
}
