'use client'

import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

const MyPopover = () => {
  const [showPopover, setShowPopover] = useState(false);

  const popover = (
    <Popover id="my-popover">
      <Popover.Title as="h3">
        My Popover
        <Button variant="link" className="close-button" onClick={() => setShowPopover(false)}>
          &times;
        </Button>
      </Popover.Title>
      <Popover.Content>
        This is the content of my popover.
      </Popover.Content>
    </Popover>
  );

  return (
    <div>
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        show={showPopover}
        onToggle={(show) => setShowPopover(show)}
        overlay={popover}
      >
        <Button variant="primary">Open Popover</Button>
      </OverlayTrigger>
    </div>
  );
}

export default MyPopover;
