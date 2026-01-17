import React from 'react'
import CardSwap, { Card } from '../react-bits/Card'

function Services() {
  return (
    <div>
      <div className='bg-red-400' style={{ height: '500px', position: 'relative' }}>
  <CardSwap
    cardDistance={60}
    verticalDistance={70}
    delay={5000}
    pauseOnHover={false}
  >
    <Card>
        <img src="" alt="" />
      {/* <h3>Card 1</h3>
      <p>Your content here</p> */}
    </Card>
    <Card>
      <h3>Card 2</h3>
      <p>Your content here</p>
    </Card>
    <Card>
      <h3>Card 3</h3>
      <p>Your content here</p>
    </Card>
  </CardSwap>
</div>
    </div>
  )
}

export default Services
