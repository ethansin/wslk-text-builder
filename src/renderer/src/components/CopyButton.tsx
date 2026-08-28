import { useState } from 'react'

interface Props {
  text: string
}

export function CopyButton({ text }: Props): JSX.Element {
  const [copied, setCopied] = useState(false)

  const handleClick = async (): Promise<void> => {
    await window.api.copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button type="button" className="copy-button" onClick={handleClick}>
      {copied ? 'Copied!' : 'Copy to Clipboard'}
    </button>
  )
}
