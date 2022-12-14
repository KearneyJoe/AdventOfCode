const fs = require("fs");

const data = fs
    .readFileSync("dummy.txt", { encoding: "utf-8" })
    .split("\n")

function sizeChecker(data, pwd = 'home', sizeObj = {
    'home': {
        'parent': null,
        'child': [],
        'value': 0
    }
}) {
    if (data.length == 1) {
        let size = parseInt(data[0].split(' ')[0])
        return sizeObj[pwd]['value'] += size
    } else {
        if (parseInt(data[0].split(' ')[0])) {
            sizeObj[pwd]['value'] += parseInt(data[0].split(' ')[0])
        } else if (data[0] == '$ cd .') {
            pwd = sizeObj[pwd]['parent']
        } else if (data[0] == '$ cd ..') {
            let parent = sizeObj[pwd]['parent']
            pwd = sizeObj[parent]['parent']
        } else if (data[0] == '$ cd /') {
            pwd = 'home'
        } else if (data[0].slice(0, 4) == '$ cd') {
            let temp = data[0].split(' ')
            let dirName = temp[temp.length - 1]

            if (sizeObj[pwd]['child'].indexOf(dirName) == -1) {
                sizeObj[pwd]['child'].push(dirName)
                sizeObj[dirName] = { 'parent': pwd, 'child': [], 'value': 0 }
            }
            pwd = dirName
        }
        sizeChecker(data.slice(1,), pwd, sizeObj)
    }
    return sizeObj
}

console.log("MAIN DATA: ", sizeChecker(data))

let sizeObject = sizeChecker(data)
let dirSizes = {}
for (const [key, value] of Object.entries(sizeObject)) {
    dirSizes[key] = 0
    if (sizeObject[key]['child'].length == 0) {
        dirSizes[key] = sizeObject[key]['value']
    } else {
        for (let i = 0; i < sizeObject[key]['child'].length; i++) {
            dirSizes[key] = sizeObject[key]['value'] + sizeAdder(sizeObject[key]['child'][i], sizeObject)
        }
    }
}

function sizeAdder(key, sizeObject, size = 0) {
    if (sizeObject[key]['child'].length == 0) {
        return size + sizeObject[key]['value']
    } else {
        let size = sizeObject[key]['value']
        let subtotal = 0
        for (let i = 0; i < sizeObject[key]['child'].length; i++) {
            subtotal += sizeAdder(sizeObject[key]['child'][i], sizeObject)
        }
        return size + subtotal
    }
}

console.log(dirSizes)
// console.log(sizeObject)
let part1Total = 0
for (const [key, value] of Object.entries(dirSizes)) {
    if (value <= 100000) {
        part1Total += value
    }
}
console.log(part1Total)



//Part 1: FIRST GUESS 1191739
//Part 1: SECOND GUESS 1493377