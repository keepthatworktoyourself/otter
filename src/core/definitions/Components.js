import OBool from '../components/default-ui/OBool'
import OBtn from '../components/default-ui/OBtn'
import OErrorMessage from '../components/default-ui/OErrorMessage'
import OFieldLabel from '../components/default-ui/OFieldLabel'
import OFieldWrapper from '../components/default-ui/OFieldWrapper'
import OInput from '../components/default-ui/OInput'
import ORadios from '../components/default-ui/ORadios'
import OSelect from '../components/default-ui/OSelect'
import OTextarea from '../components/default-ui/OTextarea'

// const MySillyInput = ({...props}) => (
//   <input style={{
//     backgroundColor: 'pink',
//     color:           'yellow',
//     padding:         '1em 1.5em',
//     fontFamily:      'Impact',
//     borderRadius:    '8px',
//   }}
//          {...props} />
// )

export default {
  FieldWrapper: OFieldWrapper,
  FieldLabel:   OFieldLabel,
  Btn:          OBtn,
  Input:        OInput,
  // Input:      MySillyInput,
  Textarea:     OTextarea,
  Bool:         OBool,
  Radios:       ORadios,
  Select:       OSelect,
  ErrorMessage: OErrorMessage,
}