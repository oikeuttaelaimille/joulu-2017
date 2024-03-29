/**
 * @file Utils
 * @see: https://lengstorf.com/code/get-form-values-as-json/
 */

type HTMLControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is an input, false if not
 */
const isValidElement = (element: any): element is HTMLControlElement => {
  return !!(element.name && element.value)
}

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
const isValidValue = (element: HTMLControlElement) => {
  return !['checkbox', 'radio'].includes(element.type) || (element as HTMLInputElement).checked
}

/**
 * Checks if an input is a checkbox, because checkboxes allow multiple values.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a checkbox, false if not
 */
const isCheckbox = (element: HTMLControlElement): element is HTMLInputElement => element.type === 'checkbox'

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
const isMultiSelect = (element: any): element is HTMLSelectElement => element.options && (element as HTMLSelectElement).multiple

type SelectedValuesReduceCallback = (values: string[], option: HTMLOptionElement) => string[]

/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
const getSelectValues = (options: HTMLOptionsCollection) =>
  [].reduce.call<HTMLOptionsCollection, [SelectedValuesReduceCallback, []], ReturnType<SelectedValuesReduceCallback>>(
    options,
    (values, option) => (option.selected ? values.concat(option.value) : values),
    []
  )

type FormJSON = { [name: string]: string | string[] }
type FormJSONReduceCallback = (data: FormJSON, element: Element) => FormJSON

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
export const formToJSON = (elements: HTMLFormControlsCollection) =>
  [].reduce.call<HTMLFormControlsCollection, [FormJSONReduceCallback, {}], ReturnType<FormJSONReduceCallback>>(
    elements,
    (data, element) => {
      // Make sure the element has the required properties and should be added.
      if (isValidElement(element) && isValidValue(element)) {
        /*
         * Some fields allow for more than one value, so we need to check if this
         * is one of those fields and, if so, store the values as an array.
         */
        if (isCheckbox(element)) {
          data[element.name] = (data[element.name] || []).concat(element.value)
        } else if (isMultiSelect(element)) {
          data[element.name] = getSelectValues(element.options)
        } else {
          data[element.name] = element.value
        }
      }

      return data
    },
    {}
  )
