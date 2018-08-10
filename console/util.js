function deriveServer (s) {
  let result = ''
  let barSplit = s.split('//')
  if (barSplit.length === 1) {
    result += 'http://' + s
    let portSplit = barSplit[0].split(':')
    if (portSplit.length === 1) result += ':4444'
  } else {
    result += s
    let portSplit = barSplit[1].split(':')
    if (portSplit.length === 1) {
      if (barSplit[0] === 'http:') result += ':4444'
      else result += ':443'
    }
  }
  return result
}

module.exports = {
  deriveServer
}
