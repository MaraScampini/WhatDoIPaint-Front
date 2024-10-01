interface TagText {
    text: string
}
const Tag = ({text}: TagText) => {
  return (
    <div className="inline-block bg-lightTeal text-darkBg font-display uppercase px-3 rounded">{text}</div>
  )
}

export default Tag