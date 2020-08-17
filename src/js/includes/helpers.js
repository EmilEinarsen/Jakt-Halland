const targetId = e => e.target.id
const parentId = e => e.target.parentElement.id
const queryTarget = param => document.querySelector(param)
const queryTargetAll = param => document.querySelectorAll(param)
const body = () => document.body

export  {targetId, parentId, queryTarget, queryTargetAll, body}