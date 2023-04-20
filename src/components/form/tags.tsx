// @typed v1
import { Icon } from '@iconify/react'
import { useRef, useState } from 'react'
import Button from './button'
import Input from './input'

const Tags = ({
  tags,
  updateTags
}: {
  tags: string[]
  updateTags?: (tags: string[]) => void
}): JSX.Element => {
  const [text, setText] = useState<string>('')
  const [showInput, setShowInput] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>()
  const buttonRef = useRef<HTMLButtonElement>()

  const addTag = () => {
    if (!text) {
      setShowInput(false)
      return
    }
    const data = JSON.parse(JSON.stringify(tags))
    data.push(text)
    setText('')
    setShowInput(false)
    updateTags(data)
    if (buttonRef && buttonRef.current) {
      buttonRef.current.focus()
    }
  }

  const deleteTag = (index) => {
    const data = JSON.parse(JSON.stringify(tags))
    data.splice(index, 1)
    updateTags(data)
  }

  return (
    <div className="flex gap-2 flex-wrap justify-start items-center w-full">
      {tags?.length < 1 && !updateTags && <>-</>}
      {tags?.map((item, index) => {
        return (
          <div key={'item' + index} className="bg-madPink rounded-full px-3 py-1 flex">
            {item}
            {updateTags && (
              <div className="rounded-full border w-6 h-6 flex items-center justify-center -mr-1.5 ml-2">
                <Icon
                  icon="fa6-solid:xmark"
                  className="cursor-pointer text-xs"
                  onClick={() => deleteTag(index)}
                />
              </div>
            )}
          </div>
        )
      })}
      {showInput ? (
        <Input
          max={16}
          inputRef={inputRef}
          name="tag"
          value={text}
          className="rounded-full px-3 py-1 h-8 pr-10"
          wrapperClassName="relative"
          countClassName="absolute right-3 top-1.5 z-10"
          countText={false}
          onChange={(val) => setText(val ? val.toString() : '')}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              addTag()
            }
          }}
          onBlur={() => {
            addTag()
          }}
          focus={showInput}
        />
      ) : null}
      {updateTags && (
        <Button
          colour="madPink"
          hoverColour="madBlack"
          onClick={() => setShowInput(true)}
          className="text-xs"
          buttonRef={buttonRef}
        >
          <>
            {showInput ? 'Save' : 'Add tag'} <Icon icon={'fa6-solid:plus'} className="ml-2" />
          </>
        </Button>
      )}
    </div>
  )
}
export default Tags
