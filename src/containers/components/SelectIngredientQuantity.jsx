import React, {useState} from "react"
import PropTypes from 'prop-types'
import {Button} from 'reactstrap'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import {InputWithSuffix, PillsOptionList} from './controls'
import {spoons, cups, grams, kilos} from '../../data/quantities'

function QuantityTab (props) {
  const [customQty, setCustomQty] = useState('')

  return (
    <TabPane tabId={props.unitTypeId}>
      <div className="row mb-2">
        <div className="col-8 col-md-3">
          <InputWithSuffix
            suffix={props.unitLabel} 
            placeholder="Custom quantity"
            value={customQty}
            onChange={event => setCustomQty(event.target.value)}
          />  
        </div>
        <div className="col-4 col-md-2">
          <Button color="primary" className="w-100" onClick={() => props.onQtySelected(customQty)}>Set</Button>
        </div>
      </div>
      <div className="row">
        <div className="col-6 col-md-3">
          <PillsOptionList options={props.leftList} vertical onItemSelected={props.onQtySelected} />
        </div>
        <div className="col-6 col-md-3">
          <PillsOptionList options={props.rightList} vertical onItemSelected={props.onQtySelected} />
        </div>
      </div>
    </TabPane>
  )
}

export default function SelectIngredientQuantity (props) {
  const [unitTypeId, setUnitTypeId] = useState(props.initialTab)

  const handleQtySelected = function (value) {
    const qty = Number(value)
    props.onQtySelected(qty, unitTypeId)
  }

  return (
    <div>
      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink
            className={classnames({ active: unitTypeId === 'v' })}
            onClick={() => { setUnitTypeId('v') }}
          >
            Volume
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: unitTypeId === 'w' })}
            onClick={() => { setUnitTypeId('w') }}
          >
            Weight
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: unitTypeId === 'u' })}
            onClick={() => { setUnitTypeId('u') }}
          >
            Units
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={unitTypeId}>
        <QuantityTab
          unitTypeId="v"
          unitLabel="ml" 
          leftList={spoons}
          rightList={cups}
          onQtySelected={handleQtySelected}
        />
        <QuantityTab
          unitTypeId="w"
          unitLabel="grams"
          leftList={grams}
          rightList={kilos}
          onQtySelected={handleQtySelected}
        />
      </TabContent>
    </div>
  )
}

SelectIngredientQuantity.propTypes = {
  onQtySelected: PropTypes.func.isRequired
}
