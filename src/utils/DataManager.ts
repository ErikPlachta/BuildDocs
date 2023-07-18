/**
 * @file DataManager.ts
 * @path build-docs\src\utils\DataManager.ts
 * @class DataManager
 * @access public
 * @exports ManageData
 * @exports DataManager() default
 * @exports DataManager
 * @exports MangeDataTest
 */
class DataManager {
  // Constructor
  constructor() {
    // this.data = data
    // this.configPath = configPath
    this.getObjectValues = this.getObjectValues.bind(this)
  }

  // Expects key-value paired object, return all values for all K/V pair at the first level.
  getObjectValues(obj: { [key: string]: unknown }): unknown[] {
    return Object.values(obj)
  }

  // Expects key-value pair object. Returns the value for a given key.
  getObjectValue(obj: { [key: string]: unknown }, key: string): unknown {
    return obj[key]
  }

  // Expects an array of objects. Returns all values at the first level.
  getObjectArrayValues(arr: { [key: string]: unknown }[]): unknown[] {
    return arr.flatMap(obj => this.getObjectValues(obj))
  }

  // Expects an array of objects. Expects a targeted 'key' to search for.
  // Searches all objects and all of their descendent.
  // Returns results as array of objects with location, key, and value.
  getObjectArrayValue(
    arr: { [key: string]: unknown }[],
    targetKey: string,
  ): { location: string; key: string; value: unknown }[] {
    const result: { location: string; key: string; value: unknown }[] = []
    arr.forEach((obj, index) => {
      const findInObject = (
        obj: { [key: string]: any },
        path: string,
      ): void => {
        for (const key in obj) {
          if (key === targetKey) {
            result.push({ location: path, key, value: obj[key] })
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            findInObject(obj[key], path ? `${path}.${key}` : key)
          }
        }
      }
      findInObject(obj, `arr[${index}]`)
    })
    return result
  }
}


/**
 * @function MangeDataTest
 * @access public
 * @summary Test function for ManageData class.
 */
function MangeDataTest(): void {
  const dm = new DataManager()
  const obj = { a: 1, b: 2, c: 3 }
  console.log(dm.getObjectValues(obj)) // [1, 2, 3]

  console.log(dm.getObjectValue(obj, 'b')) // 2

  const arr = [
    { a: 1, b: 2 },
    { c: 3, d: 4 },
    { e: 5, f: 6 },
  ]
  console.log(dm.getObjectArrayValues(arr)) // [1, 2, 3, 4, 5, 6]

  const arr2 = [{ a: { b: { c: 1, d: 2 }, e: 3 } }, { f: 4, g: { h: 5 } }]
  console.log(dm.getObjectArrayValue(arr2, 'c')) // [{ location: 'arr[0].a.b', key: 'c', value: 1 }]
}

//-- Export the class object instantiated.


//-- Optionally export the class itself and the test.
export { 
  DataManager,
   MangeDataTest 
}
