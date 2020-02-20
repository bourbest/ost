// these allow to use the same reference each time there a selector cannot produce result so we can save a couple render
export const EMPTY_OBJECT = {}
export const EMPTY_ARRAY = []

export const getLocationQuery = (state, props) => props.location ? props.location.query : EMPTY_OBJECT
export const getParams = (state, props) => props.params


