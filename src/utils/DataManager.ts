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
    this.getObjectValuesAsArray = this.getObjectValuesAsArray.bind(this)
  }

  // Expects key-value paired object, return all values for all K/V pair at the first level.
  getObjectValuesAsArray(obj: { [key: string]: unknown }): unknown[] {
    return Object.values(obj)
  }

  // Expects key-value pair object. Returns the value for a given key.
  getObjectValue(obj: { [key: string]: unknown }, key: string): unknown {
    return obj[key]
  }

  // Expects an array of objects. Returns all values at the first level.
  getObjectArrayValues(arr: { [key: string]: unknown }[]): unknown[] {
    return arr.flatMap(obj => this.getObjectValuesAsArray(obj))
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


  /**
   * @function checkKeys
   * @access public
   * @summary Checks if an object contains all of the keys you expect it to.
   * @description Checks if an object contains all of the keys you expect it to. Returns an object with two arrays: missingKeys and extraKeys. Note: The key comparison is case-sensitive.
   * @created 2023-07-23 
   * @param {string[]} keysExpected - An array of strings as the keys you expect to find in the object.
   * @param {object} objToTest - The object to search for keys within.
   * @returns {object} - Returns an object with two arrays: missingKeys and extraKeys.
   * @example
   * const keysExpected = ['a', 'b', 'c'];
   * const objToTest = { a: 1, b: 2, c: 3, d: 4 };
   * const result = checkKeys(keysExpected, objToTest);
   * console.log('Missing keys:', result.missingKeys);
   *  // ^ Should be empty array.
   * console.log('Extra keys:', result.extraKeys);
   * // ^ Should be ['d']
   * 
   * @changelog 2023-07-23 | Erik Plachta | feat: Add function to be used by `Config` when validating integrity of the config.
   * @todo 2023-07-23 | Erik Plachta | Add additional layers of depth.
   */
  checkKeys(keysExpected: string[], objToTest: {[key: string]: any}):{ missingKeys: string[], extraKeys: string[]} 
  {
    const objectKeys = Object.keys(objToTest);
  
    // Check if all required keys exist in the object
    const missingKeys = keysExpected.filter(key => !objectKeys.includes(key));
  
    // Check if there are extra keys in the object
    const extraKeys = objectKeys.filter(key => !keysExpected.includes(key));
  
    return {missingKeys, extraKeys};
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
  console.log(dm.getObjectValuesAsArray(obj)) // [1, 2, 3]

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
