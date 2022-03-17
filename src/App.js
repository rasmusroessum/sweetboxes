import { useEffect, useRef, useState } from 'react'
import  Picker from 'emoji-picker-react'
import styled from 'styled-components'
import "./App.css"

const Container = styled.div`
  margin: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 3vh;
`

function Box({ children, k, disableCounter, ...props }) {
  const [boxState, setBoxState] = useState({})
  const [showSettings, setShowSettings] = useState(false)
  const [counter, setCount] = useState([]);
  return (
    showSettings ? <div>
      <button onClick={() => setShowSettings(false)}>...</button>
      <button onClick={() => alert(counter.join("\n"))}>Count times</button>
    </div> :
  <div 
      {...props}
      style={{
        ...(props.style ?? {}),
        display: "grid",
        placeItems: "center",
        color: "#fff"
      }}
    >
      <div onClick={() => setCount((c) => [...c, new Date()])}>
      {children}
      </div>
      {!disableCounter && (
        <>
          <div onClick={() => setCount((c) => [...c, new Date()])}>
            {counter.length}
          </div>
          <button onClick={() => setShowSettings(true)}>...</button>
          {/* <button onClick={() => alert(counter.join("\n"))}>...</button> */}
        </>
      )}
    </div>
  )
}

const StyledBox = styled(Box)`
  outline: solid black 1px;
  color: white;
  font-weight: bold;
  padding: 1vh;
  background: lightslategrey;
  font-size: 5vh;
  display: grid;
  gap: 1vh;
`

function useInterval(callback, delay) {
  const savedCallback = useRef()
  useEffect(() => {
      savedCallback.current = callback
  }, [callback]);
  useEffect(() => {
      function tick() {
          savedCallback.current()
      }
      if (delay !== null) {
          let id = setInterval(tick, delay)
          return () => clearInterval(id)
      }
  }, [delay])
}

function getDateNow(){
  const date = new Date()
  // request a weekday along with a long date
  var options = { 
     weekday: 'long',
     year: 'numeric',
     month: 'long', 
     day: 'numeric',
     hour: 'numeric', 
     minute: 'numeric', 
     second: 'numeric'
    };
  const thisDate = new Intl.DateTimeFormat(navigator.language, options).format(date).split(',').join('')
  return thisDate[0].toUpperCase() + thisDate.substring(1, thisDate.length)
  // const thisMoment = moment().format('DD MMMM YYYY hh:mm:ss');
  // const d = new Date()
  // const month = d.getMonth() + 1
  // const hours = add0(d.getHours())
  // const minuts = add0(d.getMinutes())
  // const seconds = add0(d.getSeconds())
  // const dateNow = [d.getFullYear(), month, d.getDate()].join('/')
  // const time = [hours, minuts, seconds].join(':')
  // return  thisMoment
}

function DateNow(){
  const [date, setDate] = useState([getDateNow()])
  useInterval(() => {
    setDate(getDateNow())
  }, 1000)
  return (
    <div>
      {date}
    </div>
  )
}

export default function App() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [boxes, setBoxes] = useState([]);
  const onEmojiClick = (e, obj) => {
    setBoxes([...boxes, { content: obj.emoji }])
    showEmojiPicker ? setShowEmojiPicker(false) : setShowEmojiPicker(true)
  }
  return (
    <>
      <DateNow/>
      <Container>
        { boxes.map(({ content }, i) => (
          <StyledBox key={i}>
            {content}
          </StyledBox>
        )) }
        { showEmojiPicker 
          ? <Picker onEmojiClick={onEmojiClick}/> 
          : <StyledBox disableCounter={true} onClick={
            () => { setShowEmojiPicker(true) }
        }
        > + </StyledBox> }
      </Container>
    </>
  )
}
