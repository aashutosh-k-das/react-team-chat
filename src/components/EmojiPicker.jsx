import Picker, { EmojiStyle, SkinTonePickerLocation } from 'emoji-picker-react'

// NATIVE style uses the system emoji font instead of downloading image sprites
function EmojiPicker({ onSelect }) {
  return (
    <div className="popover emoji-picker">
      <Picker
        onEmojiClick={(data) => onSelect(data.emoji)}
        emojiStyle={EmojiStyle.NATIVE}
        skinTonePickerLocation={SkinTonePickerLocation.SEARCH}
        lazyLoadEmojis
        autoFocusSearch
        width={350}
        height={420}
        previewConfig={{ showPreview: false }}
      />
    </div>
  )
}

export default EmojiPicker
