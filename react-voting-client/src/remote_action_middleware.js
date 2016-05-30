export default socket => store => next => action => {
  console.log('in middleware', action)
  return next(action)
}
