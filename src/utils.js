import { TextEncoder, TextDecoder } from 'text-encoding'
import moment from 'moment'

moment().format()

const chunk_size = 32
const num_chunks = 4
const utf8_encoder = new TextEncoder('utf8')
const utf8_decoder = new TextDecoder('utf8')

// Message parsing utils

// from jsperf
// Uint8Array => hex string
function bytesToHex(byteArrayData) {
  var ret = "",
    i = 0,
    len = byteArrayData.length
  while (i < len) {
    var a = byteArrayData[i],
      h
    if (a < 10) {
      h = "0" + a.toString(16)
    } else {
      h = a.toString(16)
    }
    ret += h
    i++
  }
  return ret
}

// from github
// hex string => Uint8Array
function hexToBytes(str) {
  if (!str) {
    return new Uint8Array()
  }

  var a = []
  for (var i = 0, len = str.length; i < len; i+=2) {
    const num = parseInt(str.substr(i, 2), 16)
    if(num) {
      a.push(num)
    }
  }

  return new Uint8Array(a)
}

// Ethereum state => message string
export function hexStringsToString(...strings) {
  var msg = ''
  strings.forEach(hex => msg += utf8_decoder.decode(hexToBytes(hex)))
  return msg
}

// message string => Ethereum state
// message string assumed to be <= chunk_size * num_chunks
export function stringToHexStrings(str) {
  var arr = utf8_encoder.encode(str)
  var arrs = []
  for(var i = 0; i < arr.length / chunk_size; i += chunk_size) {
    var chunk = arr.slice(i, i + chunk_size)
    if(chunk.length < chunk_size) {
      var newChunk = new Uint8Array(chunk_size)
      newChunk.set(chunk)
      chunk = newChunk
    }
    arrs.push('0x' + bytesToHex(chunk))
  }
  while(arrs.length < num_chunks) {
    arrs.push('0x' + bytesToHex(new Uint8Array(chunk_size)))
  }
  return arrs
}

export function stringLengthRemaining(str) {
  const arr = utf8_encoder.encode(str)
  return (chunk_size * num_chunks) - arr.length
}

// date utils

export function auctionTimeRemaining(auctionEndTime) {
  return moment(auctionEndTime).fromNow()
}

export function auctionTimeRemainingSeconds(auctionEndTime) {
  return (new Date()) - auctionEndTime
}
