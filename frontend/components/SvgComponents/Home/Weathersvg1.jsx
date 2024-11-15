import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={88}
    height={105}
    fill="none"
    {...props}
  >
    <Path
      fill="#B5C18F"
      d="M.264 73.905C.219 63.463-.171 53.01.267 42.585c.238-5.636 3.782-10.337 8.488-14.317 3.486-2.949 7.809-4.47 12.252-5.789 1.234-.366 2.725-.07 4.098-.099 6.964-.15 13.988-.869 20.878-.317 7.965.637 14.885-1.394 21.498-4.526 6.705-3.175 11.377-8.194 14.92-14.043.93-1.538 1.146-4.094 4.66-3.367 0 34.909 0 69.812-.215 104.873-.517-.093-1-.301-1.093-.6-1.258-4.089-3.528-7.537-7.372-10.322-5.179-3.751-11.027-6.105-17.692-6.225-12.657-.23-25.323-.06-37.986-.069-3.58-.002-6.947-.14-10.471-1.534C6.52 83.99 2.806 80.82 1.659 75.436c-.12-.566-.914-1.024-1.395-1.531Z"
    />
  </Svg>
)
export default SvgComponent