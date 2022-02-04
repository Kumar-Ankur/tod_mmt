import React, { useState, useEffect  } from "react";

export default function DateTime() {

  const [date, setDate] = useState(new Date())

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000)
    return function cleanup() {
      clearInterval(timer)
    }
  })
  return(
    <div>
      <p>Time: {date.toLocaleTimeString()}</p>
    </div>
  )
}