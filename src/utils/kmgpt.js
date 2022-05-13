export function dataSizeFormate(value) {
  if (value === 0) {
    return '0.00 B'
  } else {
    const e = Math.floor(Math.log(value) / Math.log(1024))
    return (value / Math.pow(1024, e)).toFixed(2) +
      ' ' + ' KMGTP'.charAt(e) + 'B'
  }
}

export function tableDataSizeFormator(row, column, cellValue) {
  if (cellValue === 0) {
    return '0.00 B'
  } else {
    const e = Math.floor(Math.log(cellValue) / Math.log(1024))
    return (cellValue / Math.pow(1024, e)).toFixed(2) +
      ' ' + ' KMGTP'.charAt(e) + 'B'
  }
}

/**
 * 格式化秒
 * @param int  value 总秒数
 * @return string result 格式化后的字符串
 */
export function formatSeconds(value) {
  let theTime = parseInt(value)
  let theTime1 = 0
  let theTime2 = 0
  let theTime3 = 0
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
      if (theTime2 > 24) {
        theTime3 = parseInt(theTime2 / 24)
        theTime2 = parseInt(theTime2 % 24)
      }
    }
  }
  let result = ''
  if (theTime > 0) {
    // result = '' + parseInt(theTime) + '秒'
  }
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分' + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  if (theTime3 > 0) {
    result = '' + parseInt(theTime3) + '天' + result
  }
  return result
}

export function frequencyFormate(value) {
  if (value === 0) {
    return '0.00 GHz'
  } else {
    const e = Math.floor(Math.log(value) / Math.log(1000))
    return (value / Math.pow(1000, e)).toFixed(2) +
      ' ' + ' KMGTP'.charAt(e) + 'Hz'
  }
}
