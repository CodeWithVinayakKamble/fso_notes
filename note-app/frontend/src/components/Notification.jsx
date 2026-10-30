import { Alert } from "@mui/material"


const Notification = ({ notification }) => {

  if (notification === null) return null

  const { message, type } = notification

  return (
    <Alert style={{ marginBlock: 10 }} severity={type} >{message}</Alert>
  )
}

export default Notification